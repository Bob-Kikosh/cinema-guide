import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Every new page opens scrolled to the top, like a regular page load
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
