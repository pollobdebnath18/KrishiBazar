"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { title, description, price, quantity, unit, image, location, category, farmerId, } = req.body;
        const product = await prisma_1.default.product.create({
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
    }
    catch (error) {
        res.json({
            success: false,
            message: "Error creating product",
            error: error,
        });
    }
});
exports.default = router;
