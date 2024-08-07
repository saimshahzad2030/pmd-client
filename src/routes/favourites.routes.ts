
import { Router } from "express";

import jwtConfig from "../middleware/jwt"; 
import {addToFavourites,removeFromFavourites  } from "../controllers/favourites.controller"; 
const router = Router() 

router.route("/favourites")
    .post(jwtConfig.verifyUser,addToFavourites)
    .delete(jwtConfig.verifyUser,removeFromFavourites); 
 

export default router;
