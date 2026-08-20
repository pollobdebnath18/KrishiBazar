import {
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Tractor,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardRole = "admin" | "farmer" | "buyer";

export const roleLabels: Record<DashboardRole, string> = {
  admin: "অ্যাডমিন",
  farmer: "কৃষক",
  buyer: "ক্রেতা",
};

export const roleDescriptions: Record<DashboardRole, string> = {
  admin: "পুরো প্ল্যাটফর্ম পরিচালনা করুন",
  farmer: "আপনার পণ্য ও অর্ডার পরিচালনা করুন",
  buyer: "তাজা কৃষিপণ্য কিনুন",
};

export function isDashboardRole(value: string | undefined): value is DashboardRole {
  return value === "admin" || value === "farmer" || value === "buyer";
}

export function roleHome(role?: string): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "farmer") return "/dashboard/farmer";
  if (role === "buyer") return "/dashboard/buyer";
  return "/login";
}

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  variant?: "default" | "home" | "danger";
  exact?: boolean;
};

const adminNav: NavItem[] = [
  { label: "ড্যাশবোর্ড", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
  { label: "ব্যবহারকারী", href: "/dashboard/admin/users", icon: Users },
  { label: "কৃষক", href: "/dashboard/admin/farmers", icon: Tractor },
  { label: "ক্রেতা", href: "/dashboard/admin/buyers", icon: Store },
  { label: "পণ্যসমূহ", href: "/dashboard/admin/products", icon: Package },
  { label: "বাজারদর", href: "/dashboard/admin/market-prices", icon: TrendingUp },
  {
    label: "বাজারদর যোগ করুন",
    href: "/dashboard/admin/add-market-prices",
    icon: PlusCircle,
  },
  { label: "অর্ডারসমূহ", href: "/dashboard/admin/orders", icon: ClipboardList },
  { label: "সেটিংস", href: "/dashboard/admin/settings", icon: Settings },
];

const farmerNav: NavItem[] = [
  { label: "ড্যাশবোর্ড", href: "/dashboard/farmer", icon: LayoutDashboard, exact: true },
  { label: "আমার পণ্য", href: "/dashboard/farmer/my-products", icon: Package },
  {
    label: "পণ্য যোগ করুন",
    href: "/dashboard/farmer/add-product",
    icon: PlusCircle,
  },
  { label: "অর্ডারসমূহ", href: "/dashboard/farmer/orders", icon: ClipboardList },
  { label: "বাজারদর", href: "/dashboard/farmer/market-prices", icon: TrendingUp },
  { label: "প্রোফাইল", href: "/dashboard/farmer/profile", icon: User },
  { label: "সেটিংস", href: "/dashboard/farmer/settings", icon: Settings },
];

const buyerNav: NavItem[] = [
  { label: "ড্যাশবোর্ড", href: "/dashboard/buyer", icon: LayoutDashboard, exact: true },
  {
    label: "পণ্য ব্রাউজ করুন",
    href: "/dashboard/buyer/browse-products",
    icon: Search,
  },
  { label: "আমার অর্ডার", href: "/dashboard/buyer/my-orders", icon: ClipboardList },
  { label: "কার্ট", href: "/dashboard/buyer/cart", icon: ShoppingCart },
  { label: "বাজারদর", href: "/dashboard/buyer/market-prices", icon: TrendingUp },
  { label: "প্রোফাইল", href: "/dashboard/buyer/profile", icon: User },
  { label: "সেটিংস", href: "/dashboard/buyer/settings", icon: Settings },
];

export const homeNavItem: NavItem = {
  label: "হোমে ফিরে যান",
  href: "/",
  icon: Home,
  variant: "home",
};

export const logoutNavItem: NavItem = {
  label: "লগআউট",
  href: "/login",
  icon: LogOut,
  variant: "danger",
};

export const navForRole: Record<DashboardRole, NavItem[]> = {
  admin: adminNav,
  farmer: farmerNav,
  buyer: buyerNav,
};

export function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact || item.href === "/") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}