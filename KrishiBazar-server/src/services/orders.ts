import { Router } from "express";

const router = Router();

const orders = [
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

router.get("/", async (_, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
