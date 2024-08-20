"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const query_controller_1 = require("../controllers/query.controller");
const router = (0, express_1.Router)();
router.route("/query")
    .post(jwt_1.default.verifyUser, query_controller_1.addQuery);
exports.default = router;
//# sourceMappingURL=query.routes.js.map