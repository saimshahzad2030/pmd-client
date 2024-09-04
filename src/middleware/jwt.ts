import { Request, Response, NextFunction } from "express";
// import {JwtPayload} from "jsonwebtoken"; 
import jwt, { JwtPayload } from 'jsonwebtoken'
// import config from "../config";
import prisma from "../db/db";
import { serializeBigInt } from "../utils/seialize-bigint";
import { userInfo } from "os";
const jwtConfig = {
  sign(payload: object): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string);
    console.log('token', token)
    return token;
  },
  verifyUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        console.log(token)
        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You need to login first" });
          } else {
            const user = await prisma.user.findFirst({
              where: {
                token
              }
            })
            if (user) {
              res.locals.user = user
              next();
            }
            else {
              return res.status(401).json({ message: "You need to login first" });

            }

          }
        });
      } else {
        res.status(401).json({ message: "You need to login first" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  },

  authGuard(req: Request, res: Response) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");

        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            const user = await prisma.user.findFirst({
              where: {
                token
              }
            })
            if (user) {
              return res.status(200).json({ message: "User Authorized" })

            }
            return res.status(200).json({ message: "You are not authorized" })
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  },

  logOut(req: Request, res: Response) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");

        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            const fetchUser = await prisma.user.findFirst({
              where: {
                token: token
              }
            })
            const updatedUser = await prisma.user.update({
              where: {
                id: fetchUser.id
              },
              data: {
                token: null
              }
            })
            return res.status(200).json({ message: "User Logged out", updatedUser })
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  },
  fetchUserDetails(req: Request, res: Response) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        const products = req.query.products === 'true';
        const addresses = req.query.addresses === 'true';
        const notifications = req.query.notifications === 'true';
        const favourites = req.query.favourites === 'true';
        const cart = req.query.cart === 'true';
        const creditCards = req.query.creditCards === 'true';
        const digitalWallets = req.query.digitalWallets === 'true';
        const bankAccounts = req.query.bankAccounts === 'true';
        const recieverOrders = req.query.recieverOrders === 'true';
        const senderOrders = req.query.senderOrders === 'true';

        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            // req.user = decoded as JwtPayload | object;
            const user = await prisma.user.findFirst({
              where: {
                token: token
              },
              include: {
                products: products && {
                  include: {
                    images: products,
                    videos: products,
                    Specifications: products,
                    productHighlights: products,
                    favourites: products,

                  }
                },
                addresses: addresses,
                notifications: notifications,
                favourites: favourites && {
                  include: {
                    product: {
                      include: {
                        images: favourites,
                        videos: favourites,
                        Specifications: favourites,
                        productHighlights: favourites,
                        favourites: favourites,
                        cart: favourites
                      }
                    }
                  }
                },
                cart: cart,
                creditCards: creditCards,
                digitalWallets: digitalWallets,
                bankAccounts: bankAccounts,
                recieverOrders: recieverOrders && {
                  include: {
                    Shippings: {
                      include: {
                        ShippingNotifications: true
                      }
                    },
                    reciever: true,
                    sender: true
                  }
                },
                senderOrders: senderOrders && {
                  include: {
                    Shippings: {
                      include: {
                        ShippingNotifications: true
                      }
                    },
                    reciever: true,
                    sender: true
                  }
                }
              }
            })
            if (!user) {
              return res.status(401).json({ message: "You are not authorized" });

            }

            return res.status(200).json({ message: "Details Fetched", user: serializeBigInt(user) })
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).send(error);
    }
  },
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
