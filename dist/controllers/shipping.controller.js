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
exports.updateShippingArrangements = exports.fetchShipments = void 0;
const db_1 = __importDefault(require("../db/db"));
const fetchShipments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        console.log(userId);
        const shipments = yield db_1.default.order.findMany({
            where: {
                senderId: userId
            },
            include: {
                Shippings: {
                    include: {
                        ShippingNotifications: true
                    }
                },
                reciever: true,
                sender: true
            }
        });
        res.status(200).json({ message: 'Shipments fetched', shipments });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchShipments = fetchShipments;
const updateShippingArrangements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.body.status;
        const id = Number(req.body.id);
        if (!status || !id) {
            return res.status(400).json({ message: "Enter all fields" });
        }
        const userId = Number(res.locals.user.id);
        console.log(userId);
        const updatedShipment = yield db_1.default.shippings.update({
            where: {
                id
            },
            data: {
                arrangementStatus: status
            },
            include: {}
        });
        res.status(200).json({ message: 'Shipments fetched', updatedShipment });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.updateShippingArrangements = updateShippingArrangements;
//# sourceMappingURL=shipping.controller.js.map