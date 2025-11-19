import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      try {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        const res = await fetch(url, {
          method: method,
          headers: headers,
          body: body,
          signal: httpAbortCtrl.signal,
        });
        const data = await res.json();

        // filter out the current http request controller upon success
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        if (!res.ok) {
          throw new Error(data.message);
        }
        setIsLoading(false);
        return data;
      } catch (error) {
        // Ignore aborted fetches (React 18 StrictMode causes double-effect and abort on unmount)
        if (error.name === "AbortError") {
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        setError(error.message || "Something went wrong, please try again.");
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
