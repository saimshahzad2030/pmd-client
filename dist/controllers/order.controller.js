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
exports.fetchOrders = exports.addNewOrder = void 0;
const db_1 = __importDefault(require("../db/db"));
const stripe_1 = require("../stripe/stripe");
const config_1 = __importDefault(require("../config"));
const addNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity, price, orderPlacedDate, orderExpectedDate, senderId, paymentMethod, messageForSeller, metalAuthenticaitonService, shippingCost } = req.body;
        if (!orderExpectedDate) {
            return res.status(400).json({ message: "orderExpectedDate fields are required" });
        }
        if (!quantity) {
            return res.status(400).json({ message: "quantity fields are required" });
        }
        if (!orderPlacedDate) {
            return res.status(400).json({ message: "orderPlacedDate fields are required" });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: "paymentMethod fields are required" });
        }
        if (!messageForSeller) {
            return res.status(400).json({ message: "messageForSeller fields are required" });
        }
        if (!metalAuthenticaitonService) {
            return res.status(400).json({ message: "metalAuthenticaitonService fields are required" });
        }
        if (!price) {
            return res.status(400).json({ message: "price fields are required" });
        }
        if (!shippingCost) {
            return res.status(400).json({ message: "shippingCost required" });
        }
        if (!senderId) {
            return res.status(400).json({ message: "senderId required" });
        }
        const sender = yield db_1.default.user.findFirst({
            where: {
                id: senderId,
            }
        });
        const recieverId = Number((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user.id);
        const formattedOrderPlacedDate = new Date(orderPlacedDate).toISOString();
        const formattedOrderExpectedDate = new Date(orderExpectedDate).toISOString();
        const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
            amount: 10000,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa',
            confirm: true,
            transfer_data: {
                destination: sender.stripeConnectedAccountId,
            },
        }, {
            stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
        });
        console.log(paymentIntent);
        const newShipping = yield db_1.default.order.create({
            data: {
                productId,
                recieverId,
                senderId,
                orderExpectedDate: formattedOrderPlacedDate,
                orderPlacedDate: formattedOrderPlacedDate,
                price,
                quantity,
                messageForSeller,
                metalAuthenticaitonService,
                paymentMethod,
                paymentIntentId: paymentIntent.id,
                Shippings: {
                    create: {
                        cost: shippingCost,
                        ShippingNotifications: {
                            create: { notificationText: "dsadasdsd", userId: recieverId }
                        }
                    }
                }
            }
        });
        console.log(newShipping);
        res.status(201).json({ message: "Order placed successfully", newShipping, clientSecret: paymentIntent });
        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.addNewOrder = addNewOrder;
const fetchOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        console.log(userId);
        const orders = yield db_1.default.order.findMany({
            where: {
                recieverId: userId
            },
            include: {
                Shippings: {
                    include: {
                        ShippingNotifications: true
                    }
                },
                reciever: true,
                sender: true
            }
        });
        res.status(200).json({ message: 'Orders fetched', orders });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchOrders = fetchOrders;
// export const removeProduct = async (req: Request, res: Response) => {
//     try {
//          const {id} = req.query;
//         if (!id ) {
//             return res.status(400).json({ message: "Id not provided" });
//         } 
//         const userId =Number(res.locals.user.id);
//         await prisma.images.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         await prisma.videos.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         await prisma.specifications.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         await prisma.highlights.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         let deletedProduct = await prisma.products.delete({
//             where:{
//                 id:Number(id),
//                 sellerId:userId
//             },
//         }).catch(error=>{console.log(error)})
//         return res.status(201).json({ message: "Product deleted succesfully ", deletedProduct })
//     } catch (error) {
//         res.status(500).json({ error: `Internal Server Error: ${error.message}` });
//     }
// };
//# sourceMappingURL=order.controller.js.map