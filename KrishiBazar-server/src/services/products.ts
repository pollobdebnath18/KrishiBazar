import { Router } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

const router = Router();

router.get("/featured", async (_, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error("FETCH FEATURED PRODUCTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      quantity,
      unit,
      image,
      location,
      category,
      featured,
    } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price,
        quantity,
        unit,
        image,
        location,
        category,
        featured,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

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
      const categoryAliases: Record<string, string[]> = {
        vegetables: ["vegetables", "vegetable", "সবজি", "শাকসবজি"],
        fruits: ["fruits", "fruit", "ফল", "ফলমূল"],
        grains: [
          "grains",
          "grain",
          "cereals",
          "শস্য",
          "ধান ও চাল",
          "শস্য ও ডাল",
        ],
        fish: ["fish", "মাছ"],
        meat: ["meat", "মাংস"],
        dairy: ["dairy", "দুগ্ধজাত", "দুধ ও দুগ্ধজাত", "দুধ ও দুগ্ধজাত পণ্য"],
        eggs: ["eggs", "egg", "ডিম"],
        other: [
          "other",
          "others",
          "অন্যান্য",
          "মসলা",
          "তেল",
          "ডাল",
          "পানীয়",
          "খাবার",
          "শুকনো খাবার",
        ],
      };
      const categoryValue = category.trim().toLowerCase();
      const aliases = categoryAliases[categoryValue] ?? [category.trim()];

      conditions.push({
        category: { in: aliases },
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

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    console.error("FETCH PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

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
      featured = false,
    } = req.body;

    if (
      !title ||
      !price ||
      !quantity ||
      !unit ||
      !image ||
      !location ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

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
        featured,
      },
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
