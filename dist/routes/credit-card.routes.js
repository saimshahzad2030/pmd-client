"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const credit_card_controller_1 = require("../controllers/credit-card.controller");
const router = (0, express_1.Router)();
router.route("/credit-card")
    .post(jwt_1.default.verifyUser, credit_card_controller_1.addNewCard)
    .delete(jwt_1.default.verifyUser, credit_card_controller_1.deleteCard);
exports.default = router;
//# sourceMappingURL=credit-card.routes.js.map