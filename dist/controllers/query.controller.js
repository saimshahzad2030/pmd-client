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
exports.addQuery = void 0;
const db_1 = __importDefault(require("../db/db"));
const seialize_bigint_1 = require("..//utils/seialize-bigint");
const addQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, email, phone } = req.body;
        if (!query) {
            return res.status(400).json({ message: "Enter Query" });
        }
        if (!email) {
            return res.status(400).json({ message: "Enter Email" });
        }
        if (!phone) {
            return res.status(400).json({ message: "Enter Phone" });
        }
        const userId = Number(res.locals.user.id);
        const newQuery = yield db_1.default.query.create({
            data: {
                userId,
                email,
                query,
                phone: Number(phone)
            }
        });
        return res.status(200).json({ message: "Query added succesfully", newQuery: (0, seialize_bigint_1.serializeBigInt)(newQuery) });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.addQuery = addQuery;
//# sourceMappingURL=query.controller.js.map