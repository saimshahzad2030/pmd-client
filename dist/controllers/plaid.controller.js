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
exports.exchangePublicToken = exports.createLinkToken = void 0;
const plaid_1 = require("../plaid/plaid");
const plaid_2 = require("plaid");
const db_1 = __importDefault(require("../db/db"));
const client_1 = require("@prisma/client");
const createLinkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = Number((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        const response = yield plaid_1.client.linkTokenCreate({
            user: { client_user_id: `user-${userId}` },
            client_name: 'Pmm',
            products: [plaid_2.Products.Auth],
            country_codes: [plaid_2.CountryCode.Us],
            language: 'en',
        });
        res.json({ link_token: response.data.link_token });
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
//# sourceMappingURL=plaid.controller.js.map