import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/authContext";
import { CloseIcon, MenuIcon } from "../icons";
import SearchBox from "../SearchBox/SearchBox";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user, isLoading, openLogin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `header__link${isActive ? " header__link--active" : ""}`;

  return (
    <header className="header">
      <div className="header__inner">
        <button
          className="header__burger"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="header-nav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link className="header__logo" to="/" onClick={closeMenu}>
          Cinema<span>Guide</span>
        </Link>

        <nav
          className={`header__nav${isMenuOpen ? " header__nav--open" : ""}`}
          id="header-nav"
          aria-label="Main"
        >
          <NavLink className={linkClass} to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink className={linkClass} to="/genres" onClick={closeMenu}>
            Genres
          </NavLink>
          {user && (
            <NavLink className={linkClass} to="/account" onClick={closeMenu}>
              Favorites
            </NavLink>
          )}
        </nav>

        <div className="header__search">
          <SearchBox />
        </div>

        {/* Nothing is shown until we know whether the visitor is signed in */}
        {!isLoading && (
          <div className="header__user">
            {user ? (
              <>
                <Link className="header__avatar" to="/account" title={`${user.name} ${user.surname}`}>
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button className="button button--ghost button--small" type="button" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <button className="button button--primary button--small" type="button" onClick={openLogin}>
                Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
