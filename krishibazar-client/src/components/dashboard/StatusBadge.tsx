import type {
  OrderStatus,
  ProductStatus,
  UserStatus,
} from "@/lib/dashboard/data";

interface BadgeConfig {
  label: string;
  className: string;
}

const orderConfigs: Record<OrderStatus, BadgeConfig> = {
  PENDING: { label: "অপেক্ষমাণ", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  CONFIRMED: { label: "নিশ্চিতকৃত", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  PROCESSING: { label: "প্রক্রিয়াধীন", className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20" },
  SHIPPED: { label: "পাঠানো হয়েছে", className: "bg-violet-50 text-violet-700 ring-violet-600/20" },
  DELIVERED: { label: "ডেলিভারি সম্পন্ন", className: "bg-green-50 text-green-700 ring-green-600/20" },
  CANCELLED: { label: "বাতিল", className: "bg-red-50 text-red-700 ring-red-600/20" },
};

const productConfigs: Record<ProductStatus, BadgeConfig> = {
  ACTIVE: { label: "প্রকাশিত", className: "bg-green-50 text-green-700 ring-green-600/20" },
  OUT_OF_STOCK: { label: "স্টক শেষ", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  INACTIVE: { label: "নিষ্ক্রিয়", className: "bg-gray-100 text-gray-600 ring-gray-400/20" },
};

const userConfigs: Record<UserStatus, BadgeConfig> = {
  ACTIVE: { label: "সক্রিয়", className: "bg-green-50 text-green-700 ring-green-600/20" },
  INACTIVE: { label: "নিষ্ক্রিয়", className: "bg-red-50 text-red-700 ring-red-600/20" },
};

const orderLabels: Record<OrderStatus, string> = {
  PENDING: "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিতকৃত",
  PROCESSING: "প্রক্রিয়াধীন",
  SHIPPED: "পাঠানো হয়েছে",
  DELIVERED: "ডেলিভারি সম্পন্ন",
  CANCELLED: "বাতিল",
};

export function orderStatusLabel(status: OrderStatus): string {
  return orderLabels[status];
}

function Badge({ config }: { config: BadgeConfig }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge config={orderConfigs[status]} />;
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <Badge config={productConfigs[status]} />;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge config={userConfigs[status]} />;
}