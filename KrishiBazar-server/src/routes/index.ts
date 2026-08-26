import { Router } from "express";
import products from "../services/products";
import users from "../services/users";
import marketPrice from "../services/marketPrice";
import contact from "../services/contact";

const router = Router();

router.use("/products", products)
router.use("/users", users)
router.use("/marketPrice", marketPrice)
router.use("/contact", contact)


export default router;