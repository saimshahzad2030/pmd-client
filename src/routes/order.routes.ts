import { Router } from "express"; 
import jwtConfig from "../middleware/jwt";  
import { addNewOrder } from "../controllers/order.controller";
 
const router = Router() 

router.route("/order")
    .post(jwtConfig.verifyUser,addNewOrder) 
 
 

export default router;
