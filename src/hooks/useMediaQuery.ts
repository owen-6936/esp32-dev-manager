import { useState, useEffect } from "react";

function useMediaQuery(query: string) {
  // State to store the media query result
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    // Check if window is defined to avoid SSR issues
    if (typeof window !== "undefined") {
      const mediaQueryList = window.matchMedia(query);

      // Function to update the state based on the media query list
      const listener = (event: MediaQueryListEvent) =>
        setMatches(event.matches);

      // Initial check and set the state
      setMatches(mediaQueryList.matches);

      // Add the listener for changes
      mediaQueryList.addEventListener("change", listener);

      // Cleanup function to remove the listener when the component unmounts
      return () => {
        mediaQueryList.removeEventListener("change", listener);
      };
    }
  }, [query]);

  return matches;
}

export default useMediaQuery;
