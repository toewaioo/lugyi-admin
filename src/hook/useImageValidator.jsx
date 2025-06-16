// src/hooks/useImageValidator.js
import { useState, useEffect } from "react";

const useImageValidator = (url) => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setIsValid(false);
      return;
    }

    // Basic URL pattern check first
    if (!/^https?:\/\/.+/.test(url)) {
      setIsValid(false);
      setError("Invalid URL format");
      return;
    }

    // Only proceed with actual image check if URL looks valid
    const controller = new AbortController();
    const signal = controller.signal;

    const validateImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal,
          mode: "no-cors", // This helps with CORS issues but doesn't guarantee image validity
        });

        // Check if response looks like an image
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.startsWith("image/")) {
          setIsValid(true);
          setError(null);
        } else {
          setIsValid(false);
          setError("URL does not point to a valid image");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setIsValid(false);
          setError("Failed to load image");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Add slight delay to avoid rapid requests during typing
    const timer = setTimeout(() => {
      validateImage();
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [url]);

  return { isValid, isLoading, error };
};

export default useImageValidator;
