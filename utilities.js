import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseConfig";

export const getNews = async () => {
  const newsEndpoint = httpsCallable(functions, "news");
  const articles = await (await newsEndpoint()).data.articles;
  return articles;
};

export const getMovieInfo = async (imdbId) => {
  const movieInfoEndpoint = httpsCallable(functions, "movieInfo");
  const data = await (await movieInfoEndpoint({ id: imdbId })).data;
  return {
    info: data.info,
    poster: data.poster,
  };
};

export const getID = async (title) => {
  const searchEndpoint = httpsCallable(functions, "searchMovie");
  const id = await (await searchEndpoint({ search: title })).data.id;
  return id;
};

export const getMovieInfoFromTitle = async (title) => {
  const movieInfoFromTitleEndpoint = httpsCallable(
    functions,
    "movieInfoWithSearch"
  );
  const data = await (await movieInfoFromTitleEndpoint({ search: title })).data;
  return {
    info: data.info,
    poster: data.poster,
  };
};

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
