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
exports.exchangeIdVerificationToken = exports.exchangePublicToken = exports.createLinkToken = exports.getSessionStatus = void 0;
const plaid_1 = require("../plaid/plaid");
const plaid_2 = require("plaid");
const db_1 = __importDefault(require("../db/db"));
const config_1 = __importDefault(require("../config"));
const client_1 = require("@prisma/client");
const getSessionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = Number((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        let response2;
        if (user.plaidIdVerificationAccessToken) {
            response2 = yield plaid_1.client.identityVerificationGet({
                identity_verification_id: user.plaidIdVerificationAccessToken
            });
        }
        res.json({ status: response2.data.status });
    }
    catch (error) {
        console.log(error.messaage);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.getSessionStatus = getSessionStatus;
const createLinkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const userId = Number((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        const response = yield plaid_1.client.linkTokenCreate({
            user: { client_user_id: `customer-${userId}` },
            client_name: 'Pmm',
            products: [plaid_2.Products.Auth],
            country_codes: [plaid_2.CountryCode.Us],
            language: 'en',
        });
        const userObject = { client_user_id: `customer-${userId}`, email_address: (_d = (_c = res.locals) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.email };
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        let response2;
        if (user.plaidIdVerificationAccessToken) {
            response2 = yield plaid_1.client.identityVerificationGet({
                identity_verification_id: user.plaidIdVerificationAccessToken
            });
            console.log("verificationStatus:", response2.data.status);
        }
        const tokenResponse = yield plaid_1.client.linkTokenCreate({
            user: userObject,
            products: [plaid_2.Products.IdentityVerification],
            identity_verification: {
                template_id: config_1.default.TEMPLATE_ID,
            },
            client_name: "Pmm",
            language: "en",
            country_codes: [plaid_2.CountryCode.Us],
        });
        res.json({ response: tokenResponse.data, link_token: response.data.link_token, id_verification_token: tokenResponse.data.link_token, verificationStatus: ((_e = response2 === null || response2 === void 0 ? void 0 : response2.data) === null || _e === void 0 ? void 0 : _e.status) ? (_f = response2 === null || response2 === void 0 ? void 0 : response2.data) === null || _f === void 0 ? void 0 : _f.status : null });
    }
    catch (error) {
        console.log(error.messaage);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.createLinkToken = createLinkToken;
const exchangePublicToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { public_token } = req.body;
        console.log("public token from bank: ", public_token);
        const userId = Number((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        const response = yield plaid_1.client.itemPublicTokenExchange({
            public_token,
        });
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
        if (!accessToken)
            throw new Error("Plaid token exchange failed");
        let updatedUser;
        if (accessToken) {
            updatedUser = yield db_1.default.user.update({
                where: {
                    id: userId
                },
                data: {
                    plaidAccessToken: accessToken
                }
            });
            if (updatedUser.plaidIdVerificationAccessToken) {
                updatedUser = yield db_1.default.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        buyerPaymentMethodVerified: client_1.PaymentVerified.TRUE
                    }
                });
            }
        }
        console.log(public_token, "public Token");
        console.log(accessToken, "access Token");
        res.json({ access_token: accessToken, item_id: itemId, updatedUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.exchangePublicToken = exchangePublicToken;
const exchangeIdVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { public_token } = req.body;
        console.log('public Token: ', public_token);
        const userId = Number((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        const response = yield plaid_1.client.itemPublicTokenExchange({
            public_token,
        });
        const accessToken = response.data.access_token;
        console.log(response.data);
        if (!accessToken)
            throw new Error("Plaid token exchange failed");
        let updatedUser;
        if (accessToken) {
            updatedUser = yield db_1.default.user.update({
                where: {
                    id: userId
                },
                data: {
                    plaidIdVerificationAccessToken: accessToken
                }
            });
            if (updatedUser.plaidAccessToken) {
                updatedUser = yield db_1.default.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        buyerPaymentMethodVerified: client_1.PaymentVerified.TRUE
                    }
                });
            }
        }
        console.log(accessToken, "accessToken");
        res.json({ access_token: accessToken, updatedUser });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.exchangeIdVerificationToken = exchangeIdVerificationToken;
//# sourceMappingURL=plaid.controller.js.map