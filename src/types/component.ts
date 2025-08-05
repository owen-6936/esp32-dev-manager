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

export interface ComponentStoreState {
  components: Component[];

  // Actions
  getComponentById: (id: string) => Component | undefined;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updatedFields: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
}
