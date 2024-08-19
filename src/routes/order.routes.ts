import { Router } from "express"; 
import jwtConfig from "../middleware/jwt";  
import { addNewOrder, fetchOrders } from "../controllers/order.controller";
 
const router = Router() 

router.route("/order")
    .post(jwtConfig.verifyUser,addNewOrder) 
    .get(jwtConfig.verifyUser,fetchOrders)  
 

export default router;
