import { create } from "zustand";
import type { ComponentStoreState } from "../types/component";

const useComponentStore = create<ComponentStoreState>((set, get) => ({
  components: [],
  getComponentById: (componentId) =>
    get().components.find((component) => component.id === componentId),
  addComponent: (component) =>
    set((state: ComponentStoreState) => ({
      components: [...state.components, component],
    })),
  updateComponent: (componentId, updatedFields) =>
    set((state: ComponentStoreState) => ({
      components: state.components.map((component) =>
        component.id === componentId
          ? { ...component, ...updatedFields }
          : component,
      ),
    })),
  deleteComponent: (componentId) =>
    set((state: ComponentStoreState) => ({
      components: state.components.filter(
        (component) => component.id !== componentId,
      ),
    })),
}));

export default useComponentStore;
