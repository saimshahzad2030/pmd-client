import { Router } from "express"; 
import jwtConfig from "../middleware/jwt";  
import { fetchShipments, updateShippingArrangements } from "../controllers/shipping.controller";
 
const router = Router()   
 
router.route("/shipment")
    .get(jwtConfig.verifyUser,fetchShipments)
    .patch(jwtConfig.verifyUser,updateShippingArrangements)
 

export default router;
