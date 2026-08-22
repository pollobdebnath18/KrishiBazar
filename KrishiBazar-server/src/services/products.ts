import { Router } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;

    const conditions: Prisma.ProductWhereInput[] = [];

    if (typeof search === "string" && search.trim()) {
      const term = search.trim();
      conditions.push({
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { category: { contains: term, mode: "insensitive" } },
          { location: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      });
    }

    if (typeof category === "string" && category.trim()) {
      conditions.push({
        category: { equals: category.trim(), mode: "insensitive" },
      });
    }

    if (typeof location === "string" && location.trim()) {
      conditions.push({
        location: { equals: location.trim(), mode: "insensitive" },
      });
    }

    const products = await prisma.product.findMany({
      where: conditions.length > 0 ? { AND: conditions } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error("FETCH PRODUCTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, quantity, unit, image, location, category } = req.body;

    if (!title || !price || !quantity || !unit || !image || !location || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const product = await prisma.product.create({
      data: { title, description, price, quantity, unit, image, location, category },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
