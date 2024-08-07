import { Router } from "express";
import multer from 'multer';
import jwtConfig from "../middleware/jwt"; 
import { addToCart, removeFromCart } from "../controllers/cart.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router() 

router.route("/cart")
    .post(jwtConfig.verifyUser,addToCart)
    .delete(jwtConfig.verifyUser,removeFromCart)
 
 

export default router;
