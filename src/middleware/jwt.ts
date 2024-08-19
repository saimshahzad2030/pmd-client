 import { Request,Response,NextFunction } from "express";
// import {JwtPayload} from "jsonwebtoken"; 
import jwt, { JwtPayload } from 'jsonwebtoken'
// import config from "../config";
import prisma from "../db/db";
import { serializeBigInt } from "../utils/seialize-bigint";
const jwtConfig = { 
  sign(payload:object): string  {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY  as string);
    console.log('token',token)
    return token;
  },
  verifyUser(req:Request, res:Response, next:NextFunction) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        jwt.verify(token,  process.env.JWT_SECRET_KEY   as string, async(err:any, decoded:any)=> {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else { 
            const user = await prisma.user.findFirst({
              where:{
                token
              }
            })
            if(user){
              res.locals.user = user 
              next();
            }
            else{
            return res.status(401).json({ message: "You are not authorized" });

            }
            
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  } ,
  authGuard(req:Request, res:Response) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        jwt.verify(token,  process.env.JWT_SECRET_KEY   as string, async(err:any, decoded:any)=> {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            // req.user = decoded as JwtPayload | object;
            const user = await prisma.user.findFirst({
              where:{
                token:token
              },
              include:{
                products:{
                  include:{
                    images:true,
                    videos:true,
                    Specifications:true,
                    productHighlights:true,
                    favourites:true
                  }
                },
                addresses:true,
                notifications:true,
                favourites:{
                  include:{
                    product:{
                      include:{
                        favourites:true
                      }
                    }                  }
                },
                cart:true,
                creditCards:true,
                digitalWallets:true,
                bankAccounts:true,
                recieverOrders:true,
                senderOrders:true
              }
            })
            if(!user){
            return res.status(401).json({ message: "You are not authorized" });

            }

            return res.status(200).json({message:"User Loggedin",user:serializeBigInt(user) })
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  } ,
  // async verifyAdmin(req, res, next) {
  //   const authHeader = req.headers.authorization;

  //   try {
  //     if (authHeader) {
  //       const [bearer, token] = authHeader.split(" ");
  //       // const decoded = await userModel.find({ email: token.user.email });

  //       jwt.verify(token, JWT_SECRET_KEY, async function (err, decoded) {
  //         await supabase
  //           .from("Users")
  //           .select("*")
  //           .eq("email", decoded?.user?.email);
  //         if (err) {
  //           res.status(401).json({ message: "You are not authorized" });
  //         } else if (decoded.user.role !== "admin") {
  //           console.log(decoded.newUser.role);
  //           res.status(401).json({ message: "You are not authorized" });
  //         } else {
  //           req.user = decoded;
  //           console.log("authorized");
  //           next();
  //         }
  //       });
  //     } else {
  //       res.status(401).json({ message: "You are not authorized" });
  //     }
  //   } catch (error) {
  //     res.status(520).send(error);
  //   }
  // },
};

export default jwtConfig
