import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const response = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: response.data.data, isProblemsLoading: false });
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to fetch problems");
      set({ isProblemsLoading: false });
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    set({ isProblemLoading: true });
    try {
      const response = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: response.data.data, isProblemLoading: false });
      toast.success("Problem fetched successfully");
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("Failed to fetch problem");
      set({ isProblemLoading: false });
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemsByUser: async () => {
    try {
      const response = await axiosInstance.get("/problems/get-solved-problem");
      set({ solvedProblems: response.data.data });
    } catch (error) {
      console.error("Error fetching solved problems:", error);
      toast.error("Failed to fetch solved problems");
    }
  },
}));
