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
exports.addNewOrder = void 0;
const db_1 = __importDefault(require("../db/db"));
const addNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity, price, orderPlacedDate, orderExpectedDate, senderId, paymentMethod, messageForSeller, metalAuthenticaitonService, shippingCost } = req.body;
        // if (!description ) {
        if (!orderExpectedDate || !quantity || !orderPlacedDate || !paymentMethod || !messageForSeller || !metalAuthenticaitonService || !price || !shippingCost || !senderId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log(req.body);
        const recieverId = Number((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user.id);
        const formattedOrderPlacedDate = new Date(orderPlacedDate).toISOString();
        const formattedOrderExpectedDate = new Date(orderExpectedDate).toISOString();
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
        res.status(201).json({ message: "Order placed successfully", newShipping });
        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.addNewOrder = addNewOrder;
// export const fetchProducts = async (req: Request, res: Response) => {
//     try {
//          const products = await prisma.products.findMany({
//             include:{
//                 images:true,
//                 Specifications:true,
//                 productHighlights:true,
//                 videos:true
//             }
//         })
//         res.status(200).json({message:'Produst fetched',products})
//     } catch (error) {
//         res.status(500).json({ error: `Internal Server Error: ${error.message}` });
//     }
// };
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