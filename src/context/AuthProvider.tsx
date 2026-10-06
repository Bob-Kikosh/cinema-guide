import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";

import * as authApi from "../api/auth";
import { addToFavorites, removeFromFavorites } from "../api/favorites";
import type { Movie, User } from "../types";
import { AuthContext } from "./authContext";
import type { AuthContextValue } from "./authContext";

interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Restore the session from the cookie; a 401 simply means "not signed in"
  useEffect(() => {
    let cancelled = false;

    authApi
      .getProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password);
    setUser(await authApi.getProfile());
  }, []);

  const register = useCallback(
    async (data: authApi.RegisterData) => {
      await authApi.register(data);
      await login(data.email, data.password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const setFavorite = useCallback((movieId: number, isFavorite: boolean) => {
    const id = String(movieId);

    setUser((current) => {
      if (!current) return current;

      const favorites = current.favorites.filter((item) => item !== id);

      return { ...current, favorites: isFavorite ? [...favorites, id] : favorites };
    });
  }, []);

  const toggleFavorite = useCallback(
    async (movie: Movie) => {
      if (!user) {
        toast("Sign in to save favorites");
        setIsLoginOpen(true);
        return;
      }

      const next = !user.favorites.includes(String(movie.id));

      // Update the UI right away and roll back if the request fails
      setFavorite(movie.id, next);

      try {
        if (next) {
          await addToFavorites(movie.id);
          toast.success("Added to favorites");
        } else {
          await removeFromFavorites(movie.id);
          toast.success("Removed from favorites");
        }
      } catch {
        setFavorite(movie.id, !next);
        toast.error("Failed to update favorites");
      }
    },
    [user, setFavorite]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isLoginOpen,
      openLogin,
      closeLogin,
      login,
      register,
      logout,
      isFavorite: (movieId) => Boolean(user?.favorites.includes(String(movieId))),
      toggleFavorite,
    }),
    [user, isLoading, isLoginOpen, openLogin, closeLogin, login, register, logout, toggleFavorite]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
