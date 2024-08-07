"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const digital_wallet_controller_1 = require("../controllers/digital-wallet.controller");
const router = (0, express_1.Router)();
router.route("/digital-wallet")
    .post(jwt_1.default.verifyUser, digital_wallet_controller_1.addNewWallet)
    .delete(jwt_1.default.verifyUser, digital_wallet_controller_1.deleteWallet);
exports.default = router;
//# sourceMappingURL=digital-wallet.routes.js.map