import axios from "axios";

export const instance = axios.create({
  // baseURL: "http://192.168.8.144:8182/api",
  baseURL: "/api",
  //timeout: 3000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true
});

export default async ({ Vue, store }) => {
  Vue.prototype.$axios = instance;
};
