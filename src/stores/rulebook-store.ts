"use client";
import { create } from "zustand";
import type { Rulebook } from "@/types/rulebook";

interface State {
  rulebooks: Rulebook[];
  selectedIds: string[];
  loading: boolean;
  fetch: () => Promise<void>;
  toggle: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  remove: (id: string) => Promise<void>;
}

export const useRulebookStore = create<State>((set, get) => ({
  rulebooks: [],
  selectedIds: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const r = await fetch("/api/rulebooks");
      const data = await r.json();
      const books: Rulebook[] = data.rulebooks || [];
      const { selectedIds } = get();
      const alive = books.map((b) => b.id);
      set({
        rulebooks: books,
        selectedIds: selectedIds.filter((id) => alive.includes(id)),
      });
    } finally {
      set({ loading: false });
    }
  },
  toggle: (id) => {
    const { selectedIds } = get();
    set({
      selectedIds: selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    });
  },
  selectAll: () => {
    const ready = get()
      .rulebooks.filter((r) => r.status === "ready")
      .map((r) => r.id);
    set({ selectedIds: ready });
  },
  clearSelection: () => set({ selectedIds: [] }),
  remove: async (id) => {
    await fetch(`/api/rulebooks/${id}`, { method: "DELETE" });
    await get().fetch();
  },
}));
