"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const shipping_controller_1 = require("../controllers/shipping.controller");
const router = (0, express_1.Router)();
router.route("/shipment")
    .get(jwt_1.default.verifyUser, shipping_controller_1.fetchShipments)
    .patch(jwt_1.default.verifyUser, shipping_controller_1.updateShippingArrangements);
exports.default = router;
//# sourceMappingURL=shipping.routes.js.map