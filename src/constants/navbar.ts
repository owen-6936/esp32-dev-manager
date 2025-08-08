import {
  Activity,
  BarChart3,
  BookOpen,
  Code,
  FileText,
  Package,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavbarItem {
  key: string;
  label: string;
  icon: ReactNode | any;
}

const navbarItems: NavbarItem[] = [
  { key: "", label: "Dashboard", icon: Activity },
  { key: "project", label: "Projects", icon: Code },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "learning", label: "Learning", icon: BookOpen },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "journal", label: "Journal", icon: FileText },
  { key: "account", label: "Account", icon: User },
];
export default navbarItems;
