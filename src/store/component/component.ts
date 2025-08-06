import { create } from "zustand";
import type { ComponentStoreState } from "../../types/component";
import type { Component } from "../../types/component";

const initialComponents: Component[] = [];

// 3. Create the Zustand store
export const useComponentStore = create<ComponentStoreState>((set, get) => ({
  components: initialComponents,

  // Action to get a single component by its ID
  getComponentById: (id) => {
    return get().components.find((comp) => comp.id === id);
  },

  // Action to add a new component
  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),

  // Action to update an existing component
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
