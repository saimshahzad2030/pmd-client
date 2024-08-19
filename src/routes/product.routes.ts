import { Router } from "express";
import multer from 'multer';
import jwtConfig from "../middleware/jwt";
import { addProduct, fetchProducts,   fetchSingleProduct, fetchSpecificProducts, removeProduct } from "../controllers/product.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router()

router.route("/product")
    .post(jwtConfig.verifyUser, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), addProduct)
    .delete(jwtConfig.verifyUser, removeProduct)
    .get(fetchProducts)

router.route("/specific-product")
    .get(fetchSpecificProducts)

router.route("/single-product")
    .get(fetchSingleProduct)
 
export default router;
