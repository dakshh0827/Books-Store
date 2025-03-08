import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isUpdatingPhone: false,
  isUpdatingAddress: false,

  checkAuth: async () => {
    set({isCheckingAuth: true});
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during signup.";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("Attempting to login with data:", data);
      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login successful:", res.data);
  
      set({ authUser: res.data });
      toast.success("Logged in successfully");
  
    } catch (error) {
      console.log("Error during login:", error);
      let errorMessage = "An error occurred during login.";
      if (error.response) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from the server. Please try again later.";
      }
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updatePhone: async (data) => {
    set({ isUpdatingPhone: true });
    try {
      console.log("phone: ", data);
      const res = await axiosInstance.put("/auth/updatePhone", { phone: Number(data.phone) });
      set((prev) => ({
        ...prev,
        authUser: {
          ...prev.authUser,
          phone: res.data.phone,
        },
      }));      
      toast.success("Phone updated successfully");
    } catch (error) {
      console.log("error in update phone:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingPhone: false });
    }
  },

  updateAddress: async (data) => {
    set({ isUpdatingAddress: true });
    try {
      console.log("address: ", data);
      const res = await axiosInstance.put("/auth/updateAddress", { address: String(data.address) });
      set((prev) => ({
        ...prev,
        authUser: {
          ...prev.authUser,
          address: res.data.address,
        },
      }));      
      toast.success("Address updated successfully");
    } catch (error) {
      console.log("error in update address:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingAddress: false });
    }
  },
}));