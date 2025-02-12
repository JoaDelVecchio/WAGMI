if (!import.meta.env.VITE_API_BASE_URL) {
  console.error("missing required arguments");
  throw new Error("Missing required arguments");
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
