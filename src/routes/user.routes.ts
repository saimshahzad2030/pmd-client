
import { Router } from "express";
import { changePasswordOnForget, createUser, sendOtp, getUsers, loginUser, verifyOtp, changePassword } from '../controllers/user.controller';
import jwtConfig from "../middleware/jwt";
import { sendEmail } from '../services/send-email';
import { verify } from "crypto";
const router = Router()
// const userRoutes = express.Router();

router.route("/user")
    .post(createUser)
    .patch(jwtConfig.verifyUser,changePassword)
    .delete(jwtConfig.verifyUser,changePassword)
    .get(jwtConfig.authGuard);
router.route("/user/login")
    .post(loginUser)

router.route('/user/email')
    .post(sendOtp)
router.route("/user/admin").get(jwtConfig.verifyUser, getUsers);

router.route('/user/otp')
    .post(verifyOtp)
    .patch(changePasswordOnForget);

export default router;
