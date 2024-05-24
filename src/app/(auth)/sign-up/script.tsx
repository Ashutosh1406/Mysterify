import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * @param value - The value to be debounced. In this case, it is the username.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounceValue = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
