// src/store/useUserStore.js
import { create } from "zustand";

const useUserStore = create((set) => ({
  email: "",
  role: "",
  setUser: (email, role) => set({ email, role }),
}));

export default useUserStore;
