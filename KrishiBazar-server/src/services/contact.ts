import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });
    } catch (error) {
        console.error("CONTACT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;