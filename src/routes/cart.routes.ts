import { Router } from "express";
import multer from 'multer';
import jwtConfig from "../middleware/jwt"; 
import { addToCart, fetchCartItems, removeFromCart } from "../controllers/cart.controller";
 
const router = Router() 

router.route("/cart")
    .post(jwtConfig.verifyUser,addToCart)
    .delete(jwtConfig.verifyUser,removeFromCart)
    .get(jwtConfig.verifyUser,fetchCartItems)
 
 

export default router;
