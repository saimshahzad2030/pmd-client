"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLicenseImage = exports.updateProfile = exports.getSellerAccountDetails = exports.getUsers = exports.deleteUser = exports.changeInfo = exports.sendOtp = exports.verifyOtp = exports.changePassword = exports.changePasswordOnForget = exports.loginUser = exports.createUser = void 0;
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const send_email_1 = require("../services/send-email");
const generate_token_1 = require("../services/generate-token");
const client_1 = require("@prisma/client");
const stripe_1 = require("../stripe/stripe");
const config_1 = __importDefault(require("../config"));
const upload_file_1 = require("../services/upload-file");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !lastName || !firstName || !password) {
            return res.status(404).json({ message: "All fields requried" });
        }
        const userExist = yield db_1.default.user.findFirst({
            where: {
                email: email,
            },
        });
        if (userExist) {
            return res.status(409).json({ message: "User already exist" });
        }
        const hashPaswd = yield bcrypt_1.default.hash(password, 10);
        const stripeAccount = yield stripe_1.stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: email,
            capabilities: {
                transfers: { requested: true },
                card_payments: {
                    requested: true,
                },
            },
        });
        const user = yield db_1.default.user.create({
            data: {
                email,
                password: hashPaswd,
                lastName,
                firstName,
                stripeConnectedAccountId: stripeAccount.id
            }
        });
        res.status(200).json({ message: "User created Succesfully", user });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ message: "All fields requried" });
        }
        const userExist = yield db_1.default.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!userExist) {
            return res.status(409).json({ message: "Wrong Credentials" });
        }
        const encryptedPassword = yield bcrypt_1.default.compare(password, userExist.password);
        console.log(encryptedPassword);
        if (!encryptedPassword) {
            return res.status(409).json({ message: "Wrong credentials" });
        }
        const token = jwt_1.default.sign({ user: { id: userExist.id, email: userExist.email, stripeConnectedAccountId: userExist.stripeConnectedAccountId } });
        const updatedUser = yield db_1.default.user.update({
            where: {
                id: userExist.id,
            },
            data: {
                token
            },
        });
        res.status(200).json({ message: "Login Succesfull", updatedUser });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.loginUser = loginUser;
const changePasswordOnForget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        if (!password) {
            return res.status(404).json({ message: "Enter new Password please" });
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        // const userId:number = res.locals.user.id
        yield db_1.default.user.update({
            where: {
                email
            },
            data: {
                password: encryptedPassword
            }
        }).catch((error) => {
            return res.status(520).json({ error });
        });
        const updatedUser = yield db_1.default.user.findFirst({
            where: {
                email
            }
        });
        res.status(200).json({ message: "Password Succesfully changed", updatedUser });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.changePasswordOnForget = changePasswordOnForget;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(404).json({ message: "Enter both passwords please" });
        }
        const userId = res.locals.user.id;
        const userExist = yield db_1.default.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!userExist) {
            return res.status(401).json({ message: "You are not authorized" });
        }
        const decryptedPassword = yield bcrypt_1.default.compare(oldPassword, userExist.password);
        if (!decryptedPassword) {
            return res.status(401).json({ message: "you've entered wrong password" });
        }
        const encryptedPassword2 = yield bcrypt_1.default.hash(newPassword, 10);
        yield db_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                password: encryptedPassword2
            }
        });
        res.status(200).json({ message: "Password Succesfully updated" });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.changePassword = changePassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, otpId } = req.body;
        if (!otp || !otpId) {
            return res.status(404).json({ message: "Enter the Otp" });
        }
        const otpAlreadyExist = yield db_1.default.otp.findFirst({
            where: {
                id: otpId,
                otp
            }
        }).catch((error) => {
            console.error('Error in Prisma query:', error);
            throw new Error('Database query failed');
        });
        if (otpAlreadyExist) {
            yield db_1.default.otp.delete({
                where: {
                    id: otpAlreadyExist.id
                }
            });
            return res.status(200).json({ message: `Otp verified` });
        }
        res.status(400).json({ message: `Otp not verified` });
    }
    catch (error) {
        console.log(error, 'error from catch');
        res.status(520).json({ error });
    }
});
exports.verifyOtp = verifyOtp;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ message: "Enter the email" });
        }
        const userExist = yield db_1.default.user.findFirst({
            where: {
                email
            }
        }).catch((error) => {
            throw new Error(error);
        });
        if (!userExist) {
            return res.status(404).json({ message: "No user found" });
        }
        const verificationToken = (0, generate_token_1.generateOtp)();
        const id = userExist.id;
        const otpAlreadyExist = yield db_1.default.otp.findFirst({
            where: {
                userId: userExist.id
            }
        });
        if (otpAlreadyExist) {
            const otp = yield db_1.default.otp.update({
                where: {
                    id: otpAlreadyExist.id
                },
                data: {
                    otp: verificationToken,
                }
            });
            yield (0, send_email_1.sendEmail)(userExist.email, 'Email Verification', `${verificationToken} is your OTP`);
            return res.status(302).json({ message: `Otp Sent to ${userExist.email}`, otpId: otp.id });
        }
        const otp = yield db_1.default.otp.create({
            data: {
                otp: verificationToken,
                userId: userExist.id
            }
        });
        yield (0, send_email_1.sendEmail)(userExist.email, 'Email Verification', `${verificationToken} is your OTP`);
        res.status(302).json({ message: `Otp Sent to ${userExist.email}`, otpId: otp.id });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.sendOtp = sendOtp;
const changeInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, dateOfBirth, phone, fullName, gender } = req.body;
        if (!email || !dateOfBirth || !phone || !fullName || !gender) {
            return res.status(404).json({ message: "Enter all fields please" });
        }
        // const encryptedPassword =  await bcrypt.hash(oldPassword, 10);
        const userId = res.locals.user.id;
        const uppdatedUser = yield db_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                email,
                dateOfBirth,
                phone,
                gender,
                fullName
            }
        }).catch((error) => {
            throw new Error(error);
        });
        return res.status(200).json({ message: "user information updated succesfully", uppdatedUser });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.changeInfo = changeInfo;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(404).json({ message: "Enter Id please" });
        }
        const userId = res.locals.user.id;
        yield db_1.default.user.delete({
            where: {
                id: Number(userId)
            }
        }).catch((error) => {
            throw new Error(error);
        });
        yield stripe_1.stripe.accounts.del(res.locals.user.stripeConnectedAccountId).then(() => {
            return res.status(200).json({ message: "user deleted succesfully" });
        }).catch((error) => {
            throw new Error(error);
        });
    }
    catch (error) {
        res.status(520).send(error);
    }
});
exports.deleteUser = deleteUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const users = yield db_1.default.user.findMany({});
        const products = yield db_1.default.products.findMany({
            include: {
                Specifications: true,
                seller: true,
                images: true
            }
        });
        // await prisma.products.create({
        //   data: {
        //     sellerId: 4,
        //     name: "Elegant Platinum Necklace",
        //     quantity: 10,
        //     metalType: "Platinum",
        //     available: 17,
        //     rating: 4,
        //     price: 1500,
        //     productDetails: "A beautifully crafted gold necklace perfect for special occasions.",
        //     description: "This elegant gold necklace is made from 24k gold and features a simple yet stunning design.",
        //     Specifications: {
        //       create: [
        //         { specification: "24k gold, 18-inch chain, 5g weight" },
        //         { specification: "Handcrafted with intricate details" }
        //       ]
        //     },
        //     images: {
        //       create: [
        //         { image: "https://example.com/images/gold-necklace-1.jpg" },
        //         { image: "https://example.com/images/gold-necklace-2.jpg" }
        //       ]
        //     },
        //     productHighlights: {
        //       create: [
        //         { highlight: "Best Seller" },
        //         { highlight: "Limited Edition" }
        //       ]
        //     },
        //     videos: {
        //       create: [
        //         { video: "https://example.com/videos/gold-necklace.mp4" },
        //         { video: "https://example.com/videos/gold-necklace.mp4" },
        //         { video: "https://example.com/videos/gold-necklace.mp4" },
        //       ]
        //     },
        //   },
        // });
        res.status(200).json({ message: "Login Succesfull", users, currentUser: (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user, products });
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error);
    }
});
exports.getUsers = getUsers;
const getSellerAccountDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = res.locals.user.stripeConnectedAccountId;
        // const accountId = 'acct_1PmsHFQFAm3jyZZu' 
        const account = yield stripe_1.stripe.accounts.retrieve(accountId);
        const chargesEnabled = account.charges_enabled;
        const payoutsEnabled = account.payouts_enabled;
        if (chargesEnabled && payoutsEnabled) {
            return res.status(200).json({ authenticationRequired: false });
        }
        else {
            const accountLink = yield stripe_1.stripe.accountLinks.create({
                account: accountId,
                refresh_url: `${config_1.default.CLIENT_URL}my-account/my-shop`,
                return_url: `${config_1.default.CLIENT_URL}my-account/my-shop`,
                type: 'account_onboarding',
            });
            return res.status(200).json({ url: accountLink.url, message: 'You must provide your business details like payment options on whcih u will recieve payments etc', authenticationRequired: true });
        }
    }
    catch (error) {
        res.status(520).send(error);
    }
});
exports.getSellerAccountDetails = getSellerAccountDetails;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const userId = Number(res.locals.user.id);
        const imageUrl = yield (0, upload_file_1.uploadFile)(req.file, 'images');
        let updatedUser;
        updatedUser = yield db_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                imageUrl
            }
        });
        if (updatedUser.plaidAccessToken && updatedUser.licenseImage) {
            updatedUser = yield db_1.default.user.update({
                where: {
                    id: userId
                },
                data: {
                    verificationMessage: client_1.ResponseMessage.UnderGoingVerification
                }
            });
        }
        else {
            updatedUser = yield db_1.default.user.update({
                where: {
                    id: userId
                },
                data: {
                    verificationMessage: client_1.ResponseMessage.DetailsRequired
                }
            });
        }
        res.status(200).json({ imageUrl, updatedUser });
    }
    catch (error) {
        res.status(520).send(error);
    }
});
exports.updateProfile = updateProfile;
const addLicenseImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const userId = Number(res.locals.user.id);
        const licenseImage = yield (0, upload_file_1.uploadFile)(req.file, 'license');
        let updatedUser;
        updatedUser = yield db_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                licenseImage
            }
        });
        if (updatedUser.plaidAccessToken && updatedUser.imageUrl) {
            updatedUser = yield db_1.default.user.update({
                where: {
                    id: userId
                },
                data: {
                    verificationMessage: client_1.ResponseMessage.UnderGoingVerification
                }
            });
        }
        else {
            updatedUser = yield db_1.default.user.update({
                where: {
                    id: userId
                },
                data: {
                    verificationMessage: client_1.ResponseMessage.DetailsRequired
                }
            });
        }
        res.status(200).json({ licenseImage, updatedUser });
    }
    catch (error) {
        res.status(520).send(error);
    }
});
exports.addLicenseImage = addLicenseImage;
//# sourceMappingURL=user.controller.js.map