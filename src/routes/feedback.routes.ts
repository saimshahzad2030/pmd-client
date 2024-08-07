
import { Router } from "express";

import jwtConfig from "../middleware/jwt"; 
import { addWebAppFeedback,fetchProductsFeedbacks,fetchWebAppFeedbacks,addProductFeedback } from "../controllers/feedback.controller"; 
const router = Router()
// const userRoutes = express.Router();

router.route("/website-reviews")
    .post(jwtConfig.verifyUser,addWebAppFeedback)
    .get(jwtConfig.verifyUser,fetchWebAppFeedbacks);
router.route("/product-reviews")
    .post(jwtConfig.verifyUser,addProductFeedback)
    .get(jwtConfig.verifyUser,fetchProductsFeedbacks)
 

export default router;
