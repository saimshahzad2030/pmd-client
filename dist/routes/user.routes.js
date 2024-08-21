"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// const userRoutes = e
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.route("/user")
    .post(user_controller_1.createUser)
    .patch(jwt_1.default.verifyUser, user_controller_1.changePassword)
    .delete(jwt_1.default.verifyUser, user_controller_1.deleteUser)
    .get(jwt_1.default.authGuard);
router.route("/user/login")
    .post(user_controller_1.loginUser);
router.route("/user-info")
    .patch(jwt_1.default.verifyUser, user_controller_1.changeInfo);
router.route('/user/email')
    .post(user_controller_1.sendOtp);
router.route("/user/admin")
    .get(jwt_1.default.verifyUser, user_controller_1.getUsers);
router.route('/edit-profile')
    .patch(jwt_1.default.verifyUser, upload.single('image'), user_controller_1.updateProfile);
router.route('/user/otp')
    .post(user_controller_1.verifyOtp)
    .patch(user_controller_1.changePasswordOnForget);
router.route('/business-details')
    .get(jwt_1.default.verifyUser, user_controller_1.getSellerAccountDetails);
router.route('/user-details')
    .get(jwt_1.default.fetchUserDetails);
exports.default = router;
//# sourceMappingURL=user.routes.js.map