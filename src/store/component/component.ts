import { create } from "zustand";
import type { ComponentStoreState } from "../../types/component";
import type { Component } from "../../types/component";

const initialComponents: Component[] = [];

export const useComponentStore = create<ComponentStoreState>((set, get) => ({
  components: initialComponents,

  getComponentById: (name) => {
    return get().components.find((component) => component.name === name);
  },

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),

  updateComponent: (id, updatedFields) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, ...updatedFields } : component
      ),
    })),

  // Action to delete a component
  deleteComponent: (id) =>
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
    })),
}));
