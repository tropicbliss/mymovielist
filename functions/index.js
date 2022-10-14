const functions = require("firebase-functions");
const admin = require("firebase-admin");
const NewsApi = require("newsapi");
const {
  formatArticles,
  mapMovieInfo,
  imageUrlToBase64,
} = require("./utilities");
const { NEWS_API_KEY, OMDB_API_KEY } = require("./apiKeys");
const Filter = require("bad-words");
const { FieldValue } = require("firebase-admin/firestore");
const axios = require("axios");

const INITIAL_OMDB_URL = "http://www.omdbapi.com/?apikey=";

const api = new NewsApi(NEWS_API_KEY);

admin.initializeApp();

exports.rootQuery = functions
  .runWith({ minInstances: 1 })
  .region("us-central1")
  .https.onCall((data, context) => {
    const { query, mode } = data;
    switch (mode) {
      case "news":
        const page = query;
        return api.v2
          .topHeadlines({
            country: "us",
            category: "entertainment",
            q: "",
            pageSize: 20,
            page,
          })
          .then((result) => {
            if (!result.articles) {
              return {
                articles: [],
              };
            }
            return {
              articles: result.articles.map((article) =>
                formatArticles(article)
              ),
            };
          });
      case "movieId":
        const imdbId = query;
        return Promise.all([
          axios
            .get(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&i=${imdbId}`)
            .then((res) => res.data),
          imageUrlToBase64(
            `http://img.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`
          ),
        ]).then(([movie, poster]) => {
          if (movie.Response === "False") {
            return {
              info: null,
              poster: null,
            };
          }
          const result = mapMovieInfo(movie);
          return {
            info: result,
            poster,
          };
        });
      case "movieSearch":
        const searchTerm = query;
        return axios
          .get(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&t=${searchTerm}`)
          .then((res) => res.data)
          .then(async (movie) => {
            if (movie.Response === "False") {
              return {
                info: null,
                poster: null,
                id: null,
              };
            }
            const imdbId = movie.imdbID;
            const result = mapMovieInfo(movie);
            return {
              info: result,
              poster: await imageUrlToBase64(
                `http://img.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`
              ),
              id: imdbId,
            };
          });
      case "getMovieIdFromSearch":
        const x = query;
        return axios
          .get(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&t=${x}`)
          .then((res) => res.data)
          .then(async (movie) => {
            if (movie.Response === "False") {
              return {
                id: null,
              };
            }
            const imdbId = movie.imdbID;
            return {
              id: imdbId,
            };
          });
      default:
        throw new functions.https.HttpsError(
          "invalid-argument",
          "An unknown mode is used to call this function."
        );
    }
  });

exports.detectBadWordsInChat = functions
  .runWith({ minInstances: 1 })
  .region("asia-southeast1")
  .firestore.document("messages/{msgId}")
  .onCreate((doc, ctx) => {
    const filter = new Filter();
    const { text } = doc.data();
    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      doc.ref.update({ text: cleaned });
    }
  });

exports.detectBadWordsInReview = functions
  .runWith({ minInstances: 1 })
  .region("asia-southeast1")
  .firestore.document("reviews/{msgId}")
  .onCreate((doc, ctx) => {
    const filter = new Filter();
    const { text } = doc.data();
    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      doc.ref.update({ text: cleaned });
    }
  });

exports.updateGlobalRank = functions
  .region("asia-southeast1")
  .firestore.document("completedList/{userId}/movies/{movieId}")
  .onCreate((doc, ctx) => {
    const movieId = doc.id;
    const { userRanking, movieTitle } = doc.data();
    const globalRankDocRef = admin
      .firestore()
      .collection("globalRank")
      .doc(movieId);
    globalRankDocRef.get().then(async (oldData) => {
      if (oldData.exists) {
        const { totalSum, sampleSize } = oldData.data();
        const newMeanRanking = Math.round(
          (totalSum + userRanking) / (sampleSize + 1)
        );
        await globalRankDocRef.update({
          totalSum: FieldValue.increment(1),
          sampleSize: FieldValue.increment(userRanking),
          meanRanking: newMeanRanking,
        });
      } else {
        await globalRankDocRef.set({
          movieTitle,
          totalSum: userRanking,
          sampleSize: 1,
          meanRanking: userRanking,
        });
      }
    });
  });
