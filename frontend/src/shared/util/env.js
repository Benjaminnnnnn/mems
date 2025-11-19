const fallbackOrigin =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}`
    : "http://localhost";

export const API_URL =
  process.env.REACT_APP_BACKEND_URL || `${fallbackOrigin}:8080/api`;

export const ASSET_URL =
  process.env.REACT_APP_ASSET_URL || `${fallbackOrigin}:8080`;
