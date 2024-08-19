"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
router.route("/cart")
    .post(jwt_1.default.verifyUser, cart_controller_1.addToCart)
    .delete(jwt_1.default.verifyUser, cart_controller_1.removeFromCart)
    .get(jwt_1.default.verifyUser, cart_controller_1.fetchCartItems);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map