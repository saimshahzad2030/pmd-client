
import { Router } from "express";

import jwtConfig from "../middleware/jwt"; 
import {addNewWallet,deleteWallet} from "../controllers/digital-wallet.controller";
const router = Router() 

router.route("/digital-wallet")
    .post(jwtConfig.verifyUser,addNewWallet)
    .delete(jwtConfig.verifyUser,deleteWallet) 
 

export default router;
