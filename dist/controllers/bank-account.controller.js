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
exports.deleteBankAccount = exports.addNewBankAccount = void 0;
const db_1 = __importDefault(require("../db/db"));
const seialize_bigint_1 = require("../utils/seialize-bigint");
const addNewBankAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { bankName, accountName, accountNo } = req.body;
        if (!bankName || !accountName || !accountNo) {
            return res.status(400).json({ message: "Submit all fields" });
        }
        const userId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        let bankExist = yield db_1.default.bankAccounts.findFirst({
            where: {
                accountNo,
                bankName
            }
        }).catch(error => { console.log(error); });
        if (bankExist) {
            return res.status(400).json({ message: "Already Exist" });
        }
        let newBankAccount = yield db_1.default.bankAccounts.create({
            data: {
                userId,
                accountName,
                accountNo,
                bankName
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "New Bank Added", newBankAccount: (0, seialize_bigint_1.serializeBigInt)(newBankAccount) });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.addNewBankAccount = addNewBankAccount;
const deleteBankAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please" });
        }
        const walletId = Number(id);
        let deletedBank = yield db_1.default.bankAccounts.delete({
            where: {
                id: walletId
            }
        }).catch(error => { throw new Error(error); });
        return res.status(201).json({ message: "Bank Deleted succesfully" });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.deleteBankAccount = deleteBankAccount;
//# sourceMappingURL=bank-account.controller.js.map