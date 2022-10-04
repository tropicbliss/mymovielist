const functions = require("firebase-functions");
const NewsApi = require("newsapi");
const {
  formatArticles,
  mapMovieInfo,
  imageUrlToBase64,
} = require("./utilities");
const { NEWS_API_KEY, OMDB_API_KEY } = require("./apiKeys");
const Filter = require("bad-words");
const axios = require("axios").default;

const INITIAL_OMDB_URL = "http://www.omdbapi.com/?apikey=";

const api = new NewsApi(NEWS_API_KEY);

exports.news = functions.region("us-central1").https.onCall((data, context) => {
  const page = data.page;
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
        articles: result.articles.map((article) => formatArticles(article)),
      };
    });
});

exports.movieInfo = functions
  .region("us-central1")
  .https.onCall((data, context) => {
    const imdbId = data.id;
    return axios
      .get(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&i=${imdbId}`)
      .then((res) => res.data)
      .then(async (movie) => {
        if (movie.Response === "False") {
          return {
            info: null,
            poster: null,
          };
        }
        const result = mapMovieInfo(movie);
        return {
          info: result,
          poster: await imageUrlToBase64(
            `http://img.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`
          ),
        };
      });
  });

exports.movieInfoWithSearch = functions
  .region("us-central1")
  .https.onCall((data, context) => {
    const searchTerm = data.search;
    return axios
      .get(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&t=${searchTerm}`)
      .then((res) => res.data)
      .then(async (movie) => {
        if (movie.Response === "False") {
          return {
            info: null,
            poster: null,
          };
        }
        const imdbId = movie.imdbID;
        const result = mapMovieInfo(movie);
        return {
          info: result,
          poster:
            result &&
            (await imageUrlToBase64(
              `http://img.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`
            )),
        };
      });
  });

exports.searchMovie = functions
  .region("us-central1")
  .https.onCall((data, context) => {
    const searchTerm = data.search;
    return axios
      .get(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&t=${searchTerm}`)
      .then((res) => res.data)
      .then((movie) => {
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
  });

exports.detectBadWordsInChat = functions
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

exports.myStorageFunction;
