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
exports.fetchProductsFeedbacks = exports.fetchWebAppFeedbacks = exports.addWebAppFeedback = exports.addProductFeedback = void 0;
const db_1 = __importDefault(require("../db/db"));
const addProductFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { review, ratings, productId } = req.body;
        if (!review) {
            return res.status(400).json({ message: "Enter review" });
        }
        if (!ratings) {
            return res.status(400).json({ message: "Rate the product please" });
        }
        if (!productId) {
            return res.status(400).json({ message: "Enter Product Id please" });
        }
        const userId = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user;
        let feedback = yield db_1.default.productReviews.create({
            data: {
                review,
                userId: userId.id,
                ratings,
                productId
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "Successfully added new Review ", feedback });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.addProductFeedback = addProductFeedback;
const addWebAppFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { review, ratings } = req.body;
        if (!review) {
            return res.status(400).json({ message: "Enter review" });
        }
        if (!ratings) {
            return res.status(400).json({ message: "Rate the Website please" });
        }
        const userId = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user.id;
        let feedback = yield db_1.default.websiteReviews.create({
            data: {
                review,
                userId: userId,
                ratings
            }
        });
        return res.status(201).json({ message: "Successfully added new Review ", feedback });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.addWebAppFeedback = addWebAppFeedback;
const fetchWebAppFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = req.query;
        if (!start) {
            return res.status(400).json({ message: "Enter Start of reviews" });
        }
        if (!end) {
            return res.status(400).json({ message: "Start end of reviews" });
        }
        const startIndex = Number(start);
        const endIndex = Number(end);
        const websiteFeedbacks = yield db_1.default.websiteReviews.findMany({
            skip: startIndex,
            take: endIndex - startIndex,
            include: {
                user: true
            }
        });
        const totalReviews = yield db_1.default.websiteReviews.count();
        return res.status(201).json({ message: "Fetched successfully", websiteFeedbacks, totalReviews });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.fetchWebAppFeedbacks = fetchWebAppFeedbacks;
const fetchProductsFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = req.query;
        if (!start) {
            return res.status(400).json({ message: "Enter Start of reviews" });
        }
        if (!end) {
            return res.status(400).json({ message: "Start end of reviews" });
        }
        const startIndex = Number(start);
        const endIndex = Number(end);
        const productFeedbacks = yield db_1.default.productReviews.findMany({
            skip: startIndex,
            take: endIndex - startIndex,
            include: {
                user: true
            }
        });
        const totalReviews = yield db_1.default.productReviews.count();
        return res.status(201).json({ message: "Fetched successfully", productFeedbacks, totalReviews });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.fetchProductsFeedbacks = fetchProductsFeedbacks;
//# sourceMappingURL=feedback.controller.js.map