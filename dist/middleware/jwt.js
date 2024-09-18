"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {JwtPayload} from "jsonwebtoken"; 
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import config from "../config";
const db_1 = __importDefault(require("../db/db"));
const seialize_bigint_1 = require("../utils/seialize-bigint");
const plaid_1 = require("../plaid/plaid");
const jwtConfig = {
    sign(payload) {
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY);
        console.log('token', token);
        return token;
    },
    verifyUser(req, res, next) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                console.log(token);
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "You need to login first" });
                    }
                    else {
                        const user = yield db_1.default.user.findFirst({
                            where: {
                                token
                            }
                        });
                        if (user) {
                            res.locals.user = user;
                            next();
                        }
                        else {
                            return res.status(401).json({ message: "You need to login first" });
                        }
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You need to login first" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).send(error);
        }
    },
    authGuard(req, res) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "You are not authorized" });
                    }
                    else {
                        const user = yield db_1.default.user.findFirst({
                            where: {
                                token
                            }
                        });
                        if (user) {
                            return res.status(200).json({ message: "User Authorized" });
                        }
                        return res.status(200).json({ message: "You are not authorized" });
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You are not authorized" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).send(error);
        }
    },
    logOut(req, res) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "You are not authorized" });
                    }
                    else {
                        const fetchUser = yield db_1.default.user.findFirst({
                            where: {
                                token: token
                            }
                        });
                        const updatedUser = yield db_1.default.user.update({
                            where: {
                                id: fetchUser.id
                            },
                            data: {
                                token: null
                            }
                        });
                        return res.status(200).json({ message: "User Logged out", updatedUser });
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You are not authorized" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).send(error);
        }
    },
    fetchUserDetails(req, res) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
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
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (err) {
                        res.status(401).json({ message: "You are not authorized" });
                    }
                    else {
                        // req.user = decoded as JwtPayload | object;
                        const user = yield db_1.default.user.findFirst({
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
                        });
                        let response;
                        if (user.plaidIdVerificationAccessToken) {
                            response = yield plaid_1.client.identityVerificationGet({
                                identity_verification_id: String(user.plaidIdVerificationAccessToken)
                            });
                        }
                        if (!user) {
                            return res.status(401).json({ message: "You are not authorized" });
                        }
                        return res.status(200).json({ message: "Details Fetched", user: (0, seialize_bigint_1.serializeBigInt)(user), identityVerificationStatus: ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status) ? (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.status : null });
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You are not authorized" });
            }
        }
        catch (error) {
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
exports.default = jwtConfig;
//# sourceMappingURL=jwt.js.map