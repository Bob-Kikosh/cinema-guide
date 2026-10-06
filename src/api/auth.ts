import { api } from "./client";
import type { User } from "../types";

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  await api.post("/user", data);
};

export const login = async (email: string, password: string) => {
  await api.post("/auth/login", { email, password });
};

export const logout = async () => {
  await api.get("/auth/logout");
};

export const getProfile = async () => {
  const { data } = await api.get<User>("/profile");
  return data;
};
