import { useState, useCallback } from 'react';

export const useRateLimiter = (limitMs: number = 2000) => {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const trigger = useCallback((callback: () => void) => {
    if (isRateLimited) {
      // In a real app, we might show a toast here: toast.warning("Too many requests. Please wait.");
      return;
    }

    setIsRateLimited(true);
    callback();

    setTimeout(() => {
      setIsRateLimited(false);
    }, limitMs);
  }, [isRateLimited, limitMs]);

  return { trigger, isRateLimited };
};