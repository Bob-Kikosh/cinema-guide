import { HashRouter, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import LoginModal from "./components/LoginModal/LoginModal";
import ScrollToTop from "./components/ScrollToTop";
import { useAuth } from "./context/authContext";
import AccountPage from "./pages/AccountPage/AccountPage";
import GenreMoviesPage from "./pages/GenreMoviesPage/GenreMoviesPage";
import GenresPage from "./pages/GenresPage/GenresPage";
import HomePage from "./pages/HomePage/HomePage";
import MoviePage from "./pages/MoviePage/MoviePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import SearchPage from "./pages/SearchPage/SearchPage";

function App() {
  const { isLoginOpen } = useAuth();

  return (
    // HashRouter keeps deep links working on static hosting such as GitHub Pages
    <HashRouter>
      <ScrollToTop />
      <Header />

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genre/:genre" element={<GenreMoviesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {isLoginOpen && <LoginModal />}
    </HashRouter>
  );
}

export default App;
