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

const normalizeCart = (cart: Array<Record<string, unknown>>) =>
  Array.isArray(cart)
    ? cart.map((item) => ({
        id: String(item.id ?? item.productId ?? `${Date.now()}-${Math.random()}`),
        productId: String(item.productId ?? item.id ?? "product"),
        title: String(item.title ?? "KrishiBazar Product"),
        unit: String(item.unit ?? "কেজি"),
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 1),
        image: String(item.image ?? ""),
      }))
    : [];

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

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const item = orders.find((order) => order.id === id || order.orderNumber === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: item,
  });
});

router.post("/", async (req, res) => {
  try {
    const cart = normalizeCart(req.body?.cart ?? []);
    if (cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderTotal = cart.reduce(
      (sum, line) => sum + Number(line.price) * Number(line.quantity),
      0,
    );

    const paymentSelection = String(req.body?.paymentMethod ?? "BKASH");

    const order = {
      id: `o-${Date.now()}`,
      orderNumber: `KB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.round(1000 + Math.random() * 8999)}`,
      customer: req.body?.customer ?? "ক্রেতা",
      farmer: req.body?.farmer ?? "কৃষক",
      product: cart[0]?.title ?? "কৃষি পণ্য",
      quantity: cart.reduce((sum, line) => sum + Number(line.quantity), 0),
      unit: cart[0]?.unit ?? "কেজি",
      total: orderTotal,
      status: "PENDING",
      payment: paymentSelection === "CARD" ? "CARD" : "BKASH",
      date: new Date().toISOString().slice(0, 10),
    };

    orders.push(order);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to create order",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.post("/checkout", async (req, res) => {
  try {
    const cart = normalizeCart(req.body?.cart ?? []);
    if (!cart.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const total = cart.reduce(
      (sum, line) => sum + Number(line.price) * Number(line.quantity),
      0,
    );

    const paymentMethod = String(req.body?.paymentMethod ?? "BKASH").toUpperCase();
    const orderNumber = `KB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.round(1000 + Math.random() * 8999)}`;

    const generatedOrder = {
      id: `o-${Date.now()}`,
      orderNumber,
      customer: req.body?.customer ?? "ক্রেতা",
      farmer: req.body?.farmer ?? "কৃষক",
      product: cart[0]?.title ?? "কৃষি পণ্য",
      quantity: cart.reduce((sum, line) => sum + Number(line.quantity), 0),
      unit: cart[0]?.unit ?? "কেজি",
      total,
      status: "PENDING",
      payment: paymentMethod === "CARD" ? "CARD" : "BKASH",
      date: new Date().toISOString().slice(0, 10),
    };

    orders.push(generatedOrder);

    return res.status(200).json({
      success: true,
      message: "Checkout session created in local payment mode",
      data: {
        sessionId: `local_${Date.now()}`,
        checkoutUrl: `/checkout/success?orderNumber=${generatedOrder.orderNumber}`,
        order: generatedOrder,
        paymentMode: paymentMethod,
      },
    });
  } catch (err) {
    console.error("CREATE CHECKOUT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to create checkout session",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
