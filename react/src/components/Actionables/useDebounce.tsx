import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [hasExecuted, setHasExecuted] = useState(false);

  useEffect(() => {
    if (!hasExecuted) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
        setHasExecuted(true);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [value, delay, hasExecuted]);

  return debouncedValue;
}

export default useDebounce;
