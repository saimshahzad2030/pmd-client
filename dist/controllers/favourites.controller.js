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
exports.removeFromFavourites = exports.addToFavourites = void 0;
const db_1 = __importDefault(require("../db/db"));
const addToFavourites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Enter Product Id plaese" });
        }
        const userId = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user;
        let favourite = yield db_1.default.favourites.create({
            data: {
                userId,
                productId
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "Added to favourites succesfully ", favourite });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.addToFavourites = addToFavourites;
const removeFromFavourites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Enter Product Id plaese" });
        }
        const userId = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user;
        let productRemoved = yield db_1.default.favourites.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "Product removed from favouties succesfully ", productRemoved });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.removeFromFavourites = removeFromFavourites;
//# sourceMappingURL=favourites.controller.js.map