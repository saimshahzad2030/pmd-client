// custom.d.ts
import { JwtPayload } from "jsonwebtoken"; // Importing JwtPayload if your decoded token contains payload
import { User } from "@prisma/client";
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | string; // or any other type that matches your user object
  }
} 
// declare global {
//   namespace Express {
//     interface Request {
//       user?: User;  
//     }
//   }
// }