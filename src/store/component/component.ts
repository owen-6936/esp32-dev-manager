import { create } from "zustand";
import type { ComponentStoreState } from "../../types/component";
import type { Component } from "../../types/component";

const initialComponents: Component[] = [
  {
    id: "comp-1",
    name: "ESP32-S3-DevKitC-1",
    category: "Microcontroller",
    quantity: 5,
    unitPrice: 12.5,
    supplier: "Digi-Key",
    partNumber: "ESP32-S3-WROOM-1",
    datasheet:
      "https://www.espressif.com/sites/default/files/documentation/esp32-s3-devkitc-1_schematic_en.pdf",
    inUse: 2,
    description: "Development board based on the ESP32-S3-WROOM-1 module.",
  },
  {
    id: "comp-2",
    name: "DHT11 Humidity Sensor",
    category: "Sensor",
    quantity: 10,
    unitPrice: 1.2,
    supplier: "Adafruit",
    partNumber: "DHT11",
    datasheet: undefined,
    inUse: 3,
    description: "Basic digital temperature and humidity sensor.",
  },
  {
    id: "comp-3",
    name: "5V Step-Down Converter",
    category: "Power Management",
    quantity: 3,
    unitPrice: 3.5,
    supplier: "SparkFun",
    partNumber: "LM2596S",
    datasheet: "https://www.ti.com/lit/ds/symlink/lm2596.pdf",
    inUse: 1,
    description: "Regulator to convert higher voltage to a stable 5V output.",
  },
];

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
