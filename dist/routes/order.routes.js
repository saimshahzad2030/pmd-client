"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.route("/order")
    .post(jwt_1.default.verifyUser, order_controller_1.addNewOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map