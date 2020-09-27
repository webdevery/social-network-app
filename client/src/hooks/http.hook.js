import { useCallback, useState } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = useCallback(async (url, method = "GET", body = null, headers = {}, loadMonitor = true) => {
    try {
      if (loadMonitor) setLoading(true);
      if (body) {
        body = JSON.stringify(body);
        headers["Content-type"] = "application/json";
      }
      const responce = await fetch(url, {
        method,
        body,
        headers
      });
      const data = await responce.json();
      if (!responce.ok) {
        throw new Error(data.message || "Что то пошло не так");
      }

      setLoading(false);
      

      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, []);
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  return { loading, request, error, clearError };
};
