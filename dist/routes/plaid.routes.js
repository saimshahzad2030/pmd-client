"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const plaid_controller_1 = require("../controllers/plaid.controller");
const router = (0, express_1.Router)();
router.route("/exchange-public-token")
    .post(jwt_1.default.verifyUser, plaid_controller_1.exchangePublicToken);
router.route("/exchange-id-verification-token")
    .post(plaid_controller_1.exchangeIdVerificationToken);
router.route("/create-link-token")
    .post(jwt_1.default.verifyUser, plaid_controller_1.createLinkToken);
exports.default = router;
//# sourceMappingURL=plaid.routes.js.map