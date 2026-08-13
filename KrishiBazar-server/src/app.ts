import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// Home Route 
app.get("/", (_,res)=>{
    res.json({
        success: true,
        message: "Welcome to KrishiBazar API"
    })
})

export default app;
