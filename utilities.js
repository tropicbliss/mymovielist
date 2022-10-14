import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseConfig";

const rootEndpoint = httpsCallable(functions, "rootQuery");

export const getNews = async (page) => {
  const articles = await (
    await rootEndpoint({ query: page, mode: "news" })
  ).data.articles;
  return articles;
};

export const getMovieInfo = async (imdbId) => {
  const data = await (
    await rootEndpoint({ query: imdbId, mode: "movieId" })
  ).data;
  return {
    info: data.info,
    poster: data.poster,
  };
};

export const getID = async (title) => {
  const id = await (
    await rootEndpoint({ query: title, mode: "getMovieIdFromSearch" })
  ).data.id;
  return id;
};

export const getMovieInfoFromTitle = async (title) => {
  const data = await (
    await rootEndpoint({ query: title, mode: "movieSearch" })
  ).data;
  return {
    info: data.info,
    poster: data.poster,
    id: data.id,
  };
};

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
