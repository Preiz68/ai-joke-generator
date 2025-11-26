import { create } from "zustand";

export interface HistoryItem {
  id: string;
  joke: string;
}

interface JokeState {
  joke: string;
  setJoke: (joke: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  history: HistoryItem[];
  setHistory: (
    updater: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])
  ) => void;
  selectedCategory: string | null;
  setSelectedCategory: (selectedCategory: string | null) => void;
  rating: number | null;
  setRating: (rating: number | null) => void;
}

export const jokeStore = create<JokeState>((set) => ({
  joke: "",
  isSidebarOpen: false,
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setJoke: (joke) => set({ joke }),
  history: [],
  setHistory: (history: HistoryItem[]) => set({ history }),
  rating: null,
  setRating: (rating) => set({ rating }),
  selectedCategory: null,
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));
