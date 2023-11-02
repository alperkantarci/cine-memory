import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export const URLS = {
  IMAGE_URL: "https://image.tmdb.org/t/p/original",
  TV_SERIES_DETAILS: `${BASE_URL}/tv`,
  SEARCH_MULTI: `${BASE_URL}/search/multi`,
};

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`,
  },
});
