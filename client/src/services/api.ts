import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 20_000,
});

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string }
      | undefined;

    if (data?.message) return data.message;

    if (err.code === "ERR_NETWORK") {
      return "Cannot reach the server. Please check your connection.";
    }

    if (err.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}