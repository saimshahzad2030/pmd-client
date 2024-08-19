
import { Router } from "express";
import { changePasswordOnForget, createUser, sendOtp, getUsers, loginUser, verifyOtp, changePassword, getSellerAccountDetails, changeInfo, deleteUser, updateProfile } from '../controllers/user.controller';
import jwtConfig from "../middleware/jwt";
import multer from 'multer';

const router = Router()
// const userRoutes = e
const upload = multer({ storage: multer.memoryStorage() }); 

router.route("/user")
    .post(createUser)
    .patch(jwtConfig.verifyUser, changePassword)
    .delete(jwtConfig.verifyUser, deleteUser)
    .get(jwtConfig.authGuard);
router.route("/user/login")
    .post(loginUser)
router.route("/user-info")
    .patch(jwtConfig.verifyUser,changeInfo)
router.route('/user/email')
    .post(sendOtp)
router.route("/user/admin")
    .get(jwtConfig.verifyUser, getUsers);
router.route('/edit-profile')
    .patch(jwtConfig.verifyUser,upload.single('image'),updateProfile)
router.route('/user/otp')
    .post(verifyOtp)
    .patch(changePasswordOnForget);

router.route('/business-details')
    .get(jwtConfig.verifyUser, getSellerAccountDetails)
export default router;
