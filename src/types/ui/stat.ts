export interface StatProps {
  index: number;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  subtitleColor: string;
  subtitleIcon: React.ReactNode;
  cardVariants?: any;
}

export interface StatCardProps {
  totalProjects: number;
  completedProjects: number;
  totalComponents: number;
  totalValue: number;
  timeSpent: number;
  budgetUsed: number;
}
