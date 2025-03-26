import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/urls";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (username, email, password) => {
    set({ isLoading: true });

    // console.log("username:", username);
    // console.log("password:", password);
    // console.log("email:", email);
    try {
      console.log("Fetching:", `{BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      //   comes from data returned from auth.controller.js
      console.log("DATA.USER:", data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      console.log("Error in register useAuthStore:", err);
      return { success: false, error: err.message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      //   comes from data returned from auth.controller.js
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      console.log("Error in login useAuthStore:", err);
      return { success: false, error: err.message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });

      return { success: true };
    } catch (err) {
      console.log("Error in checkAuth authStore:", err);

      return { success: false, error: err.message };
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ token: null, user: null });

      return { success: true };
    } catch (err) {
      console.log("Error in logout useAuthStore:", err);

      return { success: false, error: err.message };
    }
  },

  deleteUser: async (userId) => {
    console.log("hola");
    set({ isLoading: true });
    console.log("in zustand", userId);

    try {
      const token = get().token;

      if (!token || !userId) {
        throw new Error("User not authenticated.");
      }

      const response = await fetch(`${BASE_URL}/auth/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }

      // If successful, clear user data from AsyncStorage and Zustand
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ token: null, user: null, isLoading: false });

      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      console.log("Error in deleteUser useAuthStore:", err);
      return { success: false, error: err.message };
    }
  },
}));
