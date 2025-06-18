import axios from "axios";

export const client = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "reqres-free-v1",
  },
});
