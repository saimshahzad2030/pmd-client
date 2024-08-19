
import { Router } from "express";

import jwtConfig from "../middleware/jwt"; 
import {addToFavourites,fetchFavourites,removeFromFavourites  } from "../controllers/favourites.controller"; 
const router = Router() 

router.route("/favourites")
    .post(jwtConfig.verifyUser,addToFavourites)
    .delete(jwtConfig.verifyUser,removeFromFavourites)
    .get(jwtConfig.verifyUser,fetchFavourites); 
 

export default router;
