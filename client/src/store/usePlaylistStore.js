import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

export const usePlaylistStore = create((set, get) => ({
  playlist: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  // Helper function to handle API errors
  handleError: (error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        defaultMessage;
    set({ isLoading: false, error: errorMessage });
    toast.error(errorMessage);
    return errorMessage;
  },

  createPlaylist: async (playlistData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.post("/playlist/create-playlist", playlistData);
      const newPlaylist = response.data?.data || response.data;

      set((state) => ({
        playlist: [...state.playlist, newPlaylist],
        isLoading: false,
        error: null
      }));

      toast.success("Playlist created successfully");
      return response.data;
    } catch (error) {
      get().handleError(error, "Failed to create playlist");
      throw error;
    }
  },

  getAllPlaylists: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get("/playlist");
      const playlists = response.data?.data || [];

      set({
        playlist: Array.isArray(playlists) ? playlists : [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      get().handleError(error, "Failed to fetch playlists");
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      const playlistDetails = response.data?.data || response.data;

      set({
        currentPlaylist: playlistDetails,
        isLoading: false,
        error: null
      });

      return playlistDetails;
    } catch (error) {
      get().handleError(error, "Failed to fetch playlist details");
      throw error;
    }
  },

  addProblemToPlaylist: async (playlistId, problemId) => {
    try {
      set({ isLoading: true, error: null });
      
      await axiosInstance.post(`/playlist/${playlistId}/add-problem`, { problemId });
      
      toast.success("Problem added to playlist");
      await get().refreshPlaylistData(playlistId);
      
      set({ isLoading: false });
    } catch (error) {
      get().handleError(error, "Failed to add problem to playlist");
      throw error;
    }
  },

  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true, error: null });
      
      const problemIdsArray = Array.isArray(problemIds) ? problemIds : [problemIds];
      
      await axiosInstance({
        method: 'DELETE',
        url: `/playlist/${playlistId}/remove-problem`,
        data: { problemIds: problemIdsArray },
        headers: { 'Content-Type': 'application/json' }
      });

      toast.success("Problem removed from playlist");
      await get().refreshPlaylistData(playlistId);
      
      set({ isLoading: false });
    } catch (error) {
      get().handleError(error, "Failed to remove problem from playlist");
      throw error;
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      set({ error: null });
      
      await axiosInstance.delete(`/playlist/${playlistId}`);

      set((state) => ({
        playlist: state.playlist.filter((p) => p.id !== playlistId),
        currentPlaylist: state.currentPlaylist?.id === playlistId ? null : state.currentPlaylist,
        error: null
      }));

      toast.success("Playlist deleted successfully");
    } catch (error) {
      const errorMessage = get().handleError(error, "Failed to delete playlist");
      throw new Error(errorMessage);
    }
  },

  // Helper function to refresh playlist data
  refreshPlaylistData: async (playlistId) => {
    const currentState = get();
    if (currentState.currentPlaylist?.id === playlistId) {
      await get().getPlaylistDetails(playlistId);
    }
    await get().getAllPlaylists();
  },
}));