import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      quantity,
      unit,
      image,
      location,
      category,
      farmerId,
    } = req.body;
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        unit,
        image,
        location,
        category,
        farmerId,
      },
    });
    res.json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error creating product",
      error: error,
    });
  }
});

export default router;
