export type ComponentCategory =
  | "passive"
  | "active"
  | "microcontroller"
  | "sensor"
  | "actuator"
  | "power_supply"
  | "display"
  | "other";
export interface Component {
  id: string;
  name: string;
  category: ComponentCategory;
  quantity: number;
  unitPrice?: number;
  supplier: string;
  partNumber: string;
  datasheet?: string;
  inUse: number;
  description: string;
  imageUrl?: string;
  totalCost?: number;
  budget?: number;
}
