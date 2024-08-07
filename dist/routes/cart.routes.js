"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const cart_controller_1 = require("../controllers/cart.controller");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.route("/cart")
    .post(jwt_1.default.verifyUser, cart_controller_1.addToCart)
    .delete(jwt_1.default.verifyUser, cart_controller_1.removeFromCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map