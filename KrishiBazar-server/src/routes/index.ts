import { Router } from "express";
import products from "../services/products";
import users from "../services/users";

const router  = Router();

router.use("/products", products)
router.use("/users", users)

export default router;