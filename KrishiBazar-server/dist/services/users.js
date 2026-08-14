"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, mobile, upazila, district, password, role } = req.body;
        if (!name || !email || !mobile || !upazila || !district || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }
        // Only farmer and buyer can register
        if (!["farmer", "buyer"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                name,
                email,
                mobile,
                upazila,
                district,
                password: hashedPassword,
                role,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: newUser.id,
            role: newUser.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    mobile: newUser.mobile,
                    upazila: newUser.upazila,
                    district: newUser.district,
                    role: newUser.role,
                },
            },
        });
    }
    catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
// Login a user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        // Check if the password is correct
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : String(err)
        });
    }
});
exports.default = router;
