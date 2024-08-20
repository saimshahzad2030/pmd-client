"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const product_controller_1 = require("../controllers/product.controller");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.route("/product")
    .post(jwt_1.default.verifyUser, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), product_controller_1.addProduct)
    .delete(jwt_1.default.verifyUser, product_controller_1.removeProduct)
    .get(product_controller_1.fetchProducts);
router.route("/specific-product")
    .get(product_controller_1.fetchSpecificProducts);
router.route("/single-product")
    .get(product_controller_1.fetchSingleProduct);
router.route("/single-product-by-type")
    .get(product_controller_1.fetchSingleProductByType);
exports.default = router;
//# sourceMappingURL=product.routes.js.map