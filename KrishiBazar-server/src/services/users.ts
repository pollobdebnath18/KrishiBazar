import { Router } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile,upazila , district, password, role } = req.body;

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
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

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

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
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// Get current user (refresh role from DB)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, mobile: true, upazila: true, district: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      data: { token: newToken, user },
    });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

// Login a user
router.post("/login" , async(req,res)=>{
  try{
    const {email,password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields"
      })
    }

    const user = await prisma.user.findUnique({
      where:{
        email
      }
    })

    if(!user){
      return res.status(404).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    )

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
    })
  }catch(err){
    console.error("LOGIN ERROR:",err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : String(err)
    })
  }
})

export default router;
