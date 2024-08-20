"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const bank_account_controller_1 = require("../controllers/bank-account.controller");
const router = (0, express_1.Router)();
router.route("/bank-account")
    .post(jwt_1.default.verifyUser, bank_account_controller_1.addNewBankAccount)
    .delete(jwt_1.default.verifyUser, bank_account_controller_1.deleteBankAccount);
exports.default = router;
//# sourceMappingURL=bank-account.routes.js.map