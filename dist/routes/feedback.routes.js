"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = (0, express_1.Router)();
// const userRoutes = express.Router();
router.route("/website-reviews")
    .post(jwt_1.default.verifyUser, feedback_controller_1.addWebAppFeedback)
    .get(jwt_1.default.verifyUser, feedback_controller_1.fetchWebAppFeedbacks);
router.route("/product-reviews")
    .post(jwt_1.default.verifyUser, feedback_controller_1.addProductFeedback)
    .get(jwt_1.default.verifyUser, feedback_controller_1.fetchProductsFeedbacks);
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map