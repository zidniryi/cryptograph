import axios from "axios";

const url = "https://api.coindesk.com/v1/bpi/";

/**
 * Base is for singleton for services
 * Instance for Axios
 */
export const base = axios.create({
  baseURL: url,
  timeout: 110000,
  headers: {
    "Content-Type": "application/json",
  },
});
