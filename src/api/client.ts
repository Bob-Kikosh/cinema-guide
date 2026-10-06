import axios from "axios";

const API_URL = "https://cinemaguide.skillbox.cc";

// The API keeps the session in a cookie. In development requests go through
// the Vite proxy (see vite.config.ts) so that the cookie is first-party.
export const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : API_URL,
  withCredentials: true,
});
