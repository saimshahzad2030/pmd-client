
import { Router } from "express";

import jwtConfig from "../middleware/jwt"; 
import {addNewBankAccount, deleteBankAccount, } from "../controllers/bank-account.controller";
const router = Router() 

router.route("/bank-account")
    .post(jwtConfig.verifyUser,addNewBankAccount)
    .delete(jwtConfig.verifyUser,deleteBankAccount) 
 

export default router;
