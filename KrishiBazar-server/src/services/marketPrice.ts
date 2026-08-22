import { Router } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      location,
      category,
      price,
      previousPrice,
      priceStatus,
      quantity,
      unit,
    } = req.body;

    if (
      !title ||
      !image ||
      !location ||
      !category ||
      price === undefined ||
      !priceStatus ||
      quantity === undefined ||
      !unit
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newMarketPrice = await prisma.marketPrice.create({
      data: {
        title,
        description,
        image,
        location,
        category,
        price,
        previousPrice,
        priceStatus,
        quantity,
        unit,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Market price created successfully",
      data: newMarketPrice,
    });
  } catch (err) {
    console.error("CREATE MARKET PRICE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, category, location, status } = req.query;

    const conditions: Prisma.MarketPriceWhereInput[] = [];

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

    if (typeof status === "string" && status.trim()) {
      const statusKeywords: Record<string, string[]> = {
        increased: ["increased", "increase", "up", "high"],
        decreased: ["decreased", "decrease", "down", "low"],
        stable: ["stable", "same", "unchanged", "flat"],
      };
      const keywords = statusKeywords[status.trim().toLowerCase()];
      if (keywords) {
        conditions.push({ priceStatus: { in: keywords } });
      }
    }

    const marketPricesProducts = await prisma.marketPrice.findMany({
      where: conditions.length > 0 ? { AND: conditions } : undefined,
      orderBy: {
        date: "desc",
      },
    });
    return res.status(200).json({
      success: true,
      message: "Market price fetched successfully",
      data: marketPricesProducts,
    });
  } catch (err) {
    console.error("MARKET PRICE ERROR:", err);
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
      image,
      location,
      category,
      price,
      previousPrice,
      priceStatus,
      quantity,
      unit,
    } = req.body;

    const updatedMarketPrice = await prisma.marketPrice.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        image,
        location,
        category,
        price,
        previousPrice,
        priceStatus,
        quantity,
        unit,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Market price updated successfully",
      data: updatedMarketPrice,
    });
  } catch (err) {
    console.error("UPDATE MARKET PRICE ERROR:", err);
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
    const deletedMarketPrice = await prisma.marketPrice.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Market price deleted successfully",
      data: deletedMarketPrice,
    });
  } catch (err) {
    console.error("DELETE MARKET PRICE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
