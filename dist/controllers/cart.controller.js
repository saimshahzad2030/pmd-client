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
exports.removeFromCart = exports.addToCart = void 0;
const db_1 = __importDefault(require("../db/db"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Product id not provided" });
        }
        const userId = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user.id;
        const product = yield db_1.default.products.findFirst({
            where: {
                id: Number(productId)
            }
        });
        if (product.sellerId != Number(res.locals.user.id)) {
            let productAlreadyExist = yield db_1.default.cart.findMany({
                where: {
                    userId: Number(res.locals.user.id)
                }
            });
            if (productAlreadyExist) {
                return res.status(400).json({ message: "product already in the cart" });
            }
            let cartItem = yield db_1.default.cart.create({
                data: {
                    productId,
                    userId
                }
            }).catch(error => { console.log(error); });
            return res.status(201).json({ message: "Added new item to cart ", cartItem });
        }
        return res.status(400).json({ message: "You cannot add your own product to cart " });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Id not provided" });
        }
        const userId = Number(res.locals.user.id);
        let deletedProduct = yield db_1.default.cart.delete({
            where: {
                id: Number(id)
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "product removed from cart succesfully ", deletedProduct });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.removeFromCart = removeFromCart;
//# sourceMappingURL=cart.controller.js.map