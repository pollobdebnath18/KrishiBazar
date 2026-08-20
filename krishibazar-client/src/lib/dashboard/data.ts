export type DashboardRole = "admin" | "farmer" | "buyer";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type ActivityType = "user" | "product" | "order" | "price";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  district: string;
  upazila: string;
  role: DashboardRole;
  status: UserStatus;
  joinedAt: string;
}

export interface DashboardProduct {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  status: ProductStatus;
  sold: number;
  revenue: number;
}

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  customer: string;
  farmer: string;
  product: string;
  quantity: number;
  unit: string;
  total: number;
  status: OrderStatus;
  payment: "COD" | "PAID";
  date: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  time: string;
}

export interface CartLine {
  id: string;
  productId: string;
  title: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

export const dashboardUsers: DashboardUser[] = [
  {
    id: "u-01",
    name: "রহিম উদ্দিন",
    email: "rahim@farmer.com",
    mobile: "01712345678",
    district: "সিলেট",
    upazila: "গোলাপগঞ্জ",
    role: "farmer",
    status: "ACTIVE",
    joinedAt: "2026-07-02",
  },
  {
    id: "u-02",
    name: "করিম মিয়া",
    email: "karim@farmer.com",
    mobile: "01812345678",
    district: "ঢাকা",
    upazila: "সাভার",
    role: "farmer",
    status: "ACTIVE",
    joinedAt: "2026-06-18",
  },
  {
    id: "u-03",
    name: "ফাতেমা বেগম",
    email: "fatema@buyer.com",
    mobile: "01912345678",
    district: "চট্টগ্রাম",
    upazila: "সীতাকুণ্ড",
    role: "buyer",
    status: "ACTIVE",
    joinedAt: "2026-07-25",
  },
  {
    id: "u-04",
    name: "মো. হাসান আলী",
    email: "hasan@buyer.com",
    mobile: "01612345678",
    district: "রাজশাহী",
    upazila: "বাগমারা",
    role: "buyer",
    status: "ACTIVE",
    joinedAt: "2026-08-01",
  },
  {
    id: "u-05",
    name: "নাজমা আক্তার",
    email: "najma@buyer.com",
    mobile: "01512345678",
    district: "খুলনা",
    upazila: "পাইকগাছা",
    role: "buyer",
    status: "INACTIVE",
    joinedAt: "2026-05-12",
  },
  {
    id: "u-06",
    name: "জাহিদুর রহমান",
    email: "jahid@farmer.com",
    mobile: "01412345678",
    district: "বরিশাল",
    upazila: "উজিরপুর",
    role: "farmer",
    status: "ACTIVE",
    joinedAt: "2026-08-10",
  },
];

export const adminDashboardProducts: DashboardProduct[] = [
  {
    id: "p-01",
    title: "তাজা টমেটো",
    category: "সবজি",
    location: "সাভার, ঢাকা",
    price: 80,
    unit: "কেজি",
    quantity: 120,
    image: "",
    status: "ACTIVE",
    sold: 340,
    revenue: 27200,
  },
  {
    id: "p-02",
    title: "দেশি আলু",
    category: "সবজি",
    location: "গোলাপগঞ্জ, সিলেট",
    price: 45,
    unit: "কেজি",
    quantity: 500,
    image: "",
    status: "ACTIVE",
    sold: 780,
    revenue: 35100,
  },
  {
    id: "p-03",
    title: "পাহাড়ি আদা",
    category: "মসলা",
    location: "খাগড়াছড়ি",
    price: 220,
    unit: "কেজি",
    quantity: 60,
    image: "",
    status: "OUT_OF_STOCK",
    sold: 95,
    revenue: 20900,
  },
  {
    id: "p-04",
    title: "ফ্রেশ কাঁচা মরিচ",
    category: "সবজি",
    location: "বগুড়া",
    price: 150,
    unit: "কেজি",
    quantity: 0,
    image: "",
    status: "OUT_OF_STOCK",
    sold: 210,
    revenue: 31500,
  },
  {
    id: "p-05",
    title: "হাঁসের ডিম",
    category: "দুগ্ধজাত",
    location: "নরসিংদী",
    price: 18,
    unit: "পিস",
    quantity: 800,
    image: "",
    status: "ACTIVE",
    sold: 1200,
    revenue: 21600,
  },
  {
    id: "p-06",
    title: "সরিষার তেল",
    category: "তেল",
    location: "জয়পুরহাট",
    price: 260,
    unit: "লিটার",
    quantity: 0,
    image: "",
    status: "INACTIVE",
    sold: 64,
    revenue: 16640,
  },
];

export const farmerProducts: DashboardProduct[] = [
  {
    id: "fp-01",
    title: "তাজা টমেটো",
    category: "সবজি",
    location: "গোলাপগঞ্জ, সিলেট",
    price: 80,
    unit: "কেজি",
    quantity: 120,
    image: "",
    status: "ACTIVE",
    sold: 340,
    revenue: 27200,
  },
  {
    id: "fp-02",
    title: "দেশি আলু",
    category: "সবজি",
    location: "গোলাপগঞ্জ, সিলেট",
    price: 45,
    unit: "কেজি",
    quantity: 500,
    image: "",
    status: "ACTIVE",
    sold: 780,
    revenue: 35100,
  },
  {
    id: "fp-03",
    title: "ফ্রেশ কাঁচা মরিচ",
    category: "সবজি",
    location: "গোলাপগঞ্জ, সিলেট",
    price: 150,
    unit: "কেজি",
    quantity: 0,
    image: "",
    status: "OUT_OF_STOCK",
    sold: 210,
    revenue: 31500,
  },
  {
    id: "fp-04",
    title: "সবুজ শিম",
    category: "সবজি",
    location: "গোলাপগঞ্জ, সিলেট",
    price: 120,
    unit: "কেজি",
    quantity: 0,
    image: "",
    status: "INACTIVE",
    sold: 88,
    revenue: 10560,
  },
];

export const buyerProducts: DashboardProduct[] = [
  {
    id: "bp-01",
    title: "হিমালয়ী চাল",
    category: "শস্য",
    location: "দিনাজপুর",
    price: 90,
    unit: "কেজি",
    quantity: 1000,
    image: "",
    status: "ACTIVE",
    sold: 0,
    revenue: 0,
  },
  {
    id: "bp-02",
    title: "তাজা টমেটো",
    category: "সবজি",
    location: "সাভার, ঢাকা",
    price: 80,
    unit: "কেজি",
    quantity: 120,
    image: "",
    status: "ACTIVE",
    sold: 0,
    revenue: 0,
  },
  {
    id: "bp-03",
    title: "দেশি আলু",
    category: "সবজি",
    location: "বগুড়া",
    price: 45,
    unit: "কেজি",
    quantity: 500,
    image: "",
    status: "ACTIVE",
    sold: 0,
    revenue: 0,
  },
  {
    id: "bp-04",
    title: "কাঁচা মরিচ",
    category: "সবজি",
    location: "বগুড়া",
    price: 150,
    unit: "কেজি",
    quantity: 60,
    image: "",
    status: "ACTIVE",
    sold: 0,
    revenue: 0,
  },
  {
    id: "bp-05",
    title: "হাঁসের ডিম",
    category: "দুগ্ধজাত",
    location: "নরসিংদী",
    price: 18,
    unit: "পিস",
    quantity: 800,
    image: "",
    status: "ACTIVE",
    sold: 0,
    revenue: 0,
  },
  {
    id: "bp-06",
    title: "সরিষার তেল",
    category: "তেল",
    location: "জয়পুরহাট",
    price: 260,
    unit: "লিটার",
    quantity: 200,
    image: "",
    status: "ACTIVE",
    sold: 0,
    revenue: 0,
  },
];

export const adminOrders: DashboardOrder[] = [
  {
    id: "o-01",
    orderNumber: "KB-20260814-0001",
    customer: "ফাতেমা বেগম",
    farmer: "রহিম উদ্দিন",
    product: "তাজা টমেটো",
    quantity: 5,
    unit: "কেজি",
    total: 400,
    status: "PENDING",
    payment: "COD",
    date: "2026-08-14",
  },
  {
    id: "o-02",
    orderNumber: "KB-20260814-0002",
    customer: "মো. হাসান আলী",
    farmer: "করিম মিয়া",
    product: "দেশি আলু",
    quantity: 20,
    unit: "কেজি",
    total: 900,
    status: "CONFIRMED",
    payment: "COD",
    date: "2026-08-14",
  },
  {
    id: "o-03",
    orderNumber: "KB-20260813-0007",
    customer: "নাজমা আক্তার",
    farmer: "রহিম উদ্দিন",
    product: "পাহাড়ি আদা",
    quantity: 2,
    unit: "কেজি",
    total: 440,
    status: "PROCESSING",
    payment: "COD",
    date: "2026-08-13",
  },
  {
    id: "o-04",
    orderNumber: "KB-20260812-0011",
    customer: "ফাতেমা বেগম",
    farmer: "জাহিদুর রহমান",
    product: "হাঁসের ডিম",
    quantity: 30,
    unit: "পিস",
    total: 540,
    status: "SHIPPED",
    payment: "PAID",
    date: "2026-08-12",
  },
  {
    id: "o-05",
    orderNumber: "KB-20260810-0009",
    customer: "মো. হাসান আলী",
    farmer: "করিম মিয়া",
    product: "ফ্রেশ কাঁচা মরিচ",
    quantity: 3,
    unit: "কেজি",
    total: 450,
    status: "DELIVERED",
    payment: "COD",
    date: "2026-08-10",
  },
  {
    id: "o-06",
    orderNumber: "KB-20260809-0003",
    customer: "নাজমা আক্তার",
    farmer: "রহিম উদ্দিন",
    product: "সরিষার তেল",
    quantity: 1,
    unit: "লিটার",
    total: 260,
    status: "CANCELLED",
    payment: "COD",
    date: "2026-08-09",
  },
];

export const farmerOrders: DashboardOrder[] = [
  {
    id: "fo-01",
    orderNumber: "KB-20260814-0001",
    customer: "ফাতেমা বেগম",
    farmer: "রহিম উদ্দিন",
    product: "তাজা টমেটো",
    quantity: 5,
    unit: "কেজি",
    total: 400,
    status: "PENDING",
    payment: "COD",
    date: "2026-08-14",
  },
  {
    id: "fo-02",
    orderNumber: "KB-20260813-0007",
    customer: "নাজমা আক্তার",
    farmer: "রহিম উদ্দিন",
    product: "পাহাড়ি আদা",
    quantity: 2,
    unit: "কেজি",
    total: 440,
    status: "PROCESSING",
    payment: "COD",
    date: "2026-08-13",
  },
  {
    id: "fo-03",
    orderNumber: "KB-20260811-0005",
    customer: "মো. হাসান আলী",
    farmer: "রহিম উদ্দিন",
    product: "দেশি আলু",
    quantity: 10,
    unit: "কেজি",
    total: 450,
    status: "SHIPPED",
    payment: "COD",
    date: "2026-08-11",
  },
  {
    id: "fo-04",
    orderNumber: "KB-20260809-0003",
    customer: "নাজমা আক্তার",
    farmer: "রহিম উদ্দিন",
    product: "সরিষার তেল",
    quantity: 1,
    unit: "লিটার",
    total: 260,
    status: "CANCELLED",
    payment: "COD",
    date: "2026-08-09",
  },
  {
    id: "fo-05",
    orderNumber: "KB-20260807-0016",
    customer: "ফাতেমা বেগম",
    farmer: "রহিম উদ্দিন",
    product: "ফ্রেশ কাঁচা মরিচ",
    quantity: 2,
    unit: "কেজি",
    total: 300,
    status: "DELIVERED",
    payment: "COD",
    date: "2026-08-07",
  },
];

export const buyerOrders: DashboardOrder[] = [
  {
    id: "bo-01",
    orderNumber: "KB-20260814-0001",
    customer: "ফাতেমা বেগম",
    farmer: "রহিম উদ্দিন",
    product: "তাজা টমেটো",
    quantity: 5,
    unit: "কেজি",
    total: 400,
    status: "PENDING",
    payment: "COD",
    date: "2026-08-14",
  },
  {
    id: "bo-02",
    orderNumber: "KB-20260812-0011",
    customer: "ফাতেমা বেগম",
    farmer: "জাহিদুর রহমান",
    product: "হাঁসের ডিম",
    quantity: 30,
    unit: "পিস",
    total: 540,
    status: "SHIPPED",
    payment: "PAID",
    date: "2026-08-12",
  },
  {
    id: "bo-03",
    orderNumber: "KB-20260807-0016",
    customer: "ফাতেমা বেগম",
    farmer: "রহিম উদ্দিন",
    product: "ফ্রেশ কাঁচা মরিচ",
    quantity: 2,
    unit: "কেজি",
    total: 300,
    status: "DELIVERED",
    payment: "COD",
    date: "2026-08-07",
  },
  {
    id: "bo-04",
    orderNumber: "KB-20260801-0008",
    customer: "ফাতেমা বেগম",
    farmer: "করিম মিয়া",
    product: "দেশি আলু",
    quantity: 8,
    unit: "কেজি",
    total: 360,
    status: "DELIVERED",
    payment: "PAID",
    date: "2026-08-01",
  },
  {
    id: "bo-05",
    orderNumber: "KB-20260728-0004",
    customer: "ফাতেমা বেগম",
    farmer: "রহিম উদ্দিন",
    product: "পাহাড়ি আদা",
    quantity: 1,
    unit: "কেজি",
    total: 220,
    status: "CANCELLED",
    payment: "COD",
    date: "2026-07-28",
  },
];

export const cartLines: CartLine[] = [
  {
    id: "c-01",
    productId: "bp-01",
    title: "হিমালয়ী চাল",
    unit: "কেজি",
    price: 90,
    quantity: 10,
    image: "",
  },
  {
    id: "c-02",
    productId: "bp-02",
    title: "তাজা টমেটো",
    unit: "কেজি",
    price: 80,
    quantity: 5,
    image: "",
  },
  {
    id: "c-03",
    productId: "bp-05",
    title: "হাঁসের ডিম",
    unit: "পিস",
    price: 18,
    quantity: 24,
    image: "",
  },
];

export const adminActivity: ActivityItem[] = [
  {
    id: "a-01",
    type: "user",
    title: "নতুন কৃষক যুক্ত হয়েছেন",
    detail: "জাহিদুর রহমান কৃষক হিসেবে নিবন্ধন করেছেন",
    time: "১০ মিনিট আগে",
  },
  {
    id: "a-02",
    type: "order",
    title: "নতুন অর্ডার #KB-20260814-0001",
    detail: "ফাতেমা বেগম ৫ কেজি টমেটো অর্ডার করেছেন",
    time: "৩২ মিনিট আগে",
  },
  {
    id: "a-03",
    type: "product",
    title: "নতুন পণ্য প্রকাশিত",
    detail: "হাঁসের ডিম পণ্যটি বাজারে যুক্ত হয়েছে",
    time: "১ ঘণ্টা আগে",
  },
  {
    id: "a-04",
    type: "price",
    title: "বাজারদর আপডেট",
    detail: "আলুর দর প্রতি কেজিতে ৪৫ টাকা করা হয়েছে",
    time: "২ ঘণ্টা আগে",
  },
  {
    id: "a-05",
    type: "user",
    title: "নতুন ক্রেতা যুক্ত হয়েছেন",
    detail: "মো. হাসান আলী ক্রেতা হিসেবে নিবন্ধন করেছেন",
    time: "৩ ঘণ্টা আগে",
  },
  {
    id: "a-06",
    type: "order",
    title: "অর্ডার ডেলিভারি সম্পন্ন",
    detail: "অর্ডার #KB-20260810-0009 ডেলিভারি হয়েছে",
    time: "৫ ঘণ্টা আগে",
  },
];

export const productPerformance = [
  { label: "আলু", value: 780 },
  { label: "টমেটো", value: 340 },
  { label: "মরিচ", value: 210 },
  { label: "শিম", value: 88 },
  { label: "আদা", value: 64 },
];

export const weeklySales = [
  { label: "রবি", value: 4200 },
  { label: "সোম", value: 3800 },
  { label: "মঙ্গল", value: 5100 },
  { label: "বুধ", value: 4600 },
  { label: "বৃহ", value: 6200 },
  { label: "শুক্র", value: 7400 },
  { label: "শনি", value: 5300 },
];

export const marketPriceTrend = [
  { label: "সোম", value: 62 },
  { label: "মঙ্গল", value: 58 },
  { label: "বুধ", value: 65 },
  { label: "বৃহ", value: 61 },
  { label: "শুক্র", value: 68 },
  { label: "শনি", value: 72 },
  { label: "রবি", value: 75 },
];
