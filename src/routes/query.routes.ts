import { Router } from "express";
import multer from 'multer';
import jwtConfig from "../middleware/jwt";
import { addQuery } from "../controllers/query.controller";
const router = Router()

router.route("/query")
    .post(jwtConfig.verifyUser,addQuery)
    
export default router;
