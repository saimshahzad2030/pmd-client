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
exports.deleteCard = exports.addNewCard = void 0;
const db_1 = __importDefault(require("../db/db"));
const seialize_bigint_1 = require("../utils/seialize-bigint");
const addNewCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { cardNumber, nameOnCard, expiryDate, cvv } = req.body;
        if (!expiryDate || !cvv || !nameOnCard || !cardNumber) {
            return res.status(400).json({ message: "Submit all fields" });
        }
        const userId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        let exist = yield db_1.default.creditCards.findFirst({
            where: {
                cardNumber,
                nameOnCard,
            }
        }).catch(error => { console.log(error); });
        if (exist) {
            return res.status(400).json({ message: "Already Exist" });
        }
        let newCreditCard = yield db_1.default.creditCards.create({
            data: {
                userId,
                cardNumber,
                cvv,
                nameOnCard,
                expiryDate
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "New Card Added", newCreditCard: (0, seialize_bigint_1.serializeBigInt)(newCreditCard) });
    }
    catch (error) {
        console.log(error);
        res.status(520).json(error);
    }
});
exports.addNewCard = addNewCard;
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please" });
        }
        const walletId = Number(id);
        let deletedCard = yield db_1.default.creditCards.delete({
            where: {
                id: walletId
            }
        }).catch(error => { throw new Error(error); });
        return res.status(201).json({ message: "Card Deleted succesfully" });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.deleteCard = deleteCard;
//# sourceMappingURL=credit-card.controller.js.map