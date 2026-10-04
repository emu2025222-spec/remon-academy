import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Central place to translate backend error shape into a readable message.
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (err.code === "ERR_NETWORK") return "Cannot reach the server. Please check your connection.";
  }
  return "Something went wrong. Please try again.";
}
