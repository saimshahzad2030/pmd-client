"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const address_controller_1 = require("../controllers/address.controller");
const router = (0, express_1.Router)();
router.route("/address")
    .post(jwt_1.default.verifyUser, address_controller_1.addNewAddress)
    .delete(jwt_1.default.verifyUser, address_controller_1.deleteAddress)
    .patch(jwt_1.default.verifyUser, address_controller_1.updateAddress);
exports.default = router;
//# sourceMappingURL=address.routes.js.map