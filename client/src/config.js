const configuredUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
export const API_URL = configuredUrl || (import.meta.env.DEV ? "http://localhost:5000" : "");
