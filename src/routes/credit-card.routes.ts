
import { Router } from "express";

import jwtConfig from "../middleware/jwt"; 
import {addNewCard,deleteCard} from "../controllers/credit-card.controller";
const router = Router() 

router.route("/credit-card")
    .post(jwtConfig.verifyUser,addNewCard)
    .delete(jwtConfig.verifyUser,deleteCard) 
 

export default router;
