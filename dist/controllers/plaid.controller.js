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
exports.exchangeIdVerificationToken = exports.exchangePublicToken = exports.createLinkToken = void 0;
const plaid_1 = require("../plaid/plaid");
const plaid_2 = require("plaid");
const db_1 = __importDefault(require("../db/db"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
const createLinkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
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
        res.json({ link_token: response.data.link_token, id_verification_token: tokenResponse.data.link_token });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.createLinkToken = createLinkToken;
const exchangePublicToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { public_token } = req.body;
        console.log("public token from exchangePublicToken: ", public_token);
        const userId = Number((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        const response = yield plaid_1.client.itemPublicTokenExchange({
            public_token,
        });
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
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
        }
        if (updatedUser.imageUrl && updatedUser.licenseImage) {
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
        res.json({ access_token: accessToken, item_id: itemId, updatedUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.exchangePublicToken = exchangePublicToken;
const exchangeIdVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { public_token } = req.body;
        console.log("public token from idV: ", public_token);
        // const userId = Number(res.locals?.user?.id);
        const response = yield plaid_1.client.itemPublicTokenExchange({ public_token: public_token });
        const access_token = response.data.access_token;
        // const itemId = response.data.item_id;
        // let updatedUser;
        // if (accessToken) {
        //     updatedUser = await prisma.user.update({
        //         where: {
        //             id: userId
        //         },
        //         data: {
        //             plaidAccessToken: accessToken
        //         }
        //     })
        // }
        // if (updatedUser.imageUrl && updatedUser.licenseImage) {
        //     updatedUser = await prisma.user.update({
        //         where: {
        //             id: userId
        //         },
        //         data: {
        //             verificationMessage: ResponseMessage.UnderGoingVerification
        //         }
        //     })
        // }
        // else {
        //     updatedUser = await prisma.user.update({
        //         where: {
        //             id: userId
        //         },
        //         data: {
        //             verificationMessage: ResponseMessage.DetailsRequired
        //         }
        //     })
        // }
        console.log(response.data);
        res.json({ access_token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.exchangeIdVerificationToken = exchangeIdVerificationToken;
//# sourceMappingURL=plaid.controller.js.map