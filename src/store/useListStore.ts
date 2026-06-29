import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface ListItem {
  profile: UserProfileSummary;
  platform: Platform;
  addedAt: number;
}

interface ListState {
  items: ListItem[];
  addItem: (profile: UserProfileSummary, platform: Platform) => boolean;
  removeItem: (userId: string) => void;
  isInList: (userId: string) => boolean;
  clearList: () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (profile, platform) => {
        if (get().items.some((item) => item.profile.user_id === profile.user_id)) {
          return false;
        }

        set((state) => ({
          items: [...state.items, { profile, platform, addedAt: Date.now() }],
        }));
        return true;
      },

      removeItem: (userId) => {
        set((state) => ({
          items: state.items.filter((item) => item.profile.user_id !== userId),
        }));
      },

      isInList: (userId) => {
        return get().items.some((item) => item.profile.user_id === userId);
      },

      clearList: () => {
        set({ items: [] });
      },
    }),
    {
      name: "influencer-list",
    }
  )
);
