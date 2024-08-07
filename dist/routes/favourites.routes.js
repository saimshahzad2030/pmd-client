"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const favourites_controller_1 = require("../controllers/favourites.controller");
const router = (0, express_1.Router)();
router.route("/favourites")
    .post(jwt_1.default.verifyUser, favourites_controller_1.addToFavourites)
    .delete(jwt_1.default.verifyUser, favourites_controller_1.removeFromFavourites);
exports.default = router;
//# sourceMappingURL=favourites.routes.js.map