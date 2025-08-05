export interface Component {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  partNumber: string;
  datasheet?: string;
  inUse: number;
  description: string;
}
