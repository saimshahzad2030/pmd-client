"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const plaid_1 = require("plaid");
const config_1 = __importDefault(require("../config"));
exports.client = new plaid_1.PlaidApi(new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': config_1.default.PLAID_CLIENT_ID,
            'PLAID-SECRET': config_1.default.PLAID_SECRET,
        },
    },
}));
//# sourceMappingURL=plaid.js.map