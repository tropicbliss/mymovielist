const functions = require("firebase-functions");
const NewsApi = require("newsapi");
const {
  formatArticles,
  mapMovieInfo,
  imageUrlToBase64,
} = require("./utilities");
const fetch = require("node-fetch");
const { NEWS_API_KEY, OMDB_API_KEY } = require("./apiKeys");
const Filter = require("bad-words");

const INITIAL_OMDB_URL = "http://www.omdbapi.com/?apikey=";

const api = new NewsApi(NEWS_API_KEY);

exports.news = functions.https.onCall((data, context) => {
  return api.v2
    .topHeadlines({
      country: "us",
      category: "entertainment",
      q: "",
      pageSize: 20,
      page: 1,
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

exports.movieInfo = functions.https.onCall((data, context) => {
  const imdbId = data.id;
  return fetch(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&i=${imdbId}`)
    .then((res) => res.json())
    .then(async (movie) => {
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

exports.searchMovie = functions.https.onCall((data, context) => {
  const searchTerm = data.search;
  return fetch(`${INITIAL_OMDB_URL}${OMDB_API_KEY}&t=${searchTerm}`)
    .then((res) => res.json())
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

exports.detectBadWordsInChat = functions.firestore
  .document("messages/{msgId}")
  .onCreate((doc, ctx) => {
    const filter = new Filter();
    const { text } = doc.data();
    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      doc.ref.update({ text: cleaned });
    }
  });

exports.detectBadWordsInReview = functions.firestore
  .document("reviews/{msgId}")
  .onCreate((doc, ctx) => {
    const filter = new Filter();
    const { text } = doc.data();
    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      doc.ref.update({ text: cleaned });
    }
  });
