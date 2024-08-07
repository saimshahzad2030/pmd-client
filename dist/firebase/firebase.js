"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_sdk_1 = require("../firebase-sdk");
const config_1 = __importDefault(require("../config"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebase_sdk_1.sdk),
    storageBucket: config_1.default.BUCKET_URL
});
exports.bucket = firebase_admin_1.default.storage().bucket();
//# sourceMappingURL=firebase.js.map