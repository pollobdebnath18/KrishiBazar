import { Router } from "express";
import products from "../services/products";
import users from "../services/users";
import marketPrice from "../services/marketPrice";

const router  = Router();

router.use("/products", products)
router.use("/users", users)
router.use("/marketPrice" , marketPrice)


export default router;