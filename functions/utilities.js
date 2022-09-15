const fetch = require("node-fetch");
const sharp = require("sharp");

const formatArticles = (article) => {
  const title = article.title;
  const url = article.url;
  const image = article.urlToImage;
  const content = formatTextWrap(
    article.description || "No description available."
  );
  return {
    title,
    url,
    image,
    content,
  };
};

const formatTextWrap = (text) => {
  const maxLineLength = 76;
  const words = String(text).trim().replace(/[\s]+/g, " ").split(" ");
  let lineLength = 0;
  return words.reduce((result, word) => {
    if (lineLength + word.length >= maxLineLength) {
      lineLength = word.length;
      return `${result}\n${word}`;
    }
    lineLength += word.length + (result ? 1 : 0);
    return result ? `${result} ${word}` : `${word}`;
  }, "");
};

const propsToShow = [
  "Title",
  "Year",
  "Released",
  "Runtime",
  "Genre",
  "Director",
  "Writer",
  "Actors",
  "Plot",
  "Language",
  "Country",
  "Awards",
  "Metascore",
  "imdbRating",
  "tomatoMeter",
  "BoxOffice",
  "Production",
];

const mapMovieInfo = (movie) => {
  if (movie.Response === "False") {
    return null;
  }
  let result = {};
  propsToShow.forEach((prop) => {
    if (movie[prop] !== "N/A") {
      result[prop] = movie[prop];
    }
  });
  return result;
};

const imageUrlToBase64 = async (url) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const data =
    "data:" +
    response.headers.get("content-type") +
    ";base64," +
    buffer.toString("base64");
  return data;
};

module.exports = { formatArticles, mapMovieInfo, imageUrlToBase64 };
