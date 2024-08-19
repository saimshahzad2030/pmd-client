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
exports.updateShippingAddress = exports.deleteAddress = exports.updateAddress = exports.addNewAddress = void 0;
const db_1 = __importDefault(require("../db/db"));
const addNewAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { address, state, city, postalcode, phone, addressType, fullName } = req.body;
        if (!address || !state || !city || !postalcode || !phone || !fullName || !addressType) {
            return res.status(400).json({ message: "Submit all fields" });
        }
        const userId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        const addressExist = yield db_1.default.address.findFirst({
            where: {
                postalcode: Number(postalcode),
                city,
                state,
                phone,
                address,
                addressType,
                fullName
            }
        });
        if (addressExist) {
            return res.status(201).json({ message: "Address already exist" });
        }
        else {
            let newAddress = yield db_1.default.address.create({
                data: {
                    userId,
                    postalcode,
                    city,
                    state,
                    phone,
                    address,
                    addressType,
                    fullName
                }
            }).catch(error => { console.log(error); });
            return res.status(201).json({ message: "New Address Added", newAddress });
        }
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.addNewAddress = addNewAddress;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { shippingAddressType, address, state, city, postalcode, phone, addressType, fullName, id } = req.body;
        if (!address || !state || !city || !postalcode || !phone || !fullName || !addressType || !id) {
            return res.status(400).json({ message: "Submit all fields" });
        }
        const userId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        let newAddress = yield db_1.default.address.update({
            where: {
                id
            },
            data: {
                userId,
                postalcode,
                city,
                state,
                phone,
                address,
                addressType,
                fullName,
                shippingAddressType: shippingAddressType
            }
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "Address Updated", newAddress });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.updateAddress = updateAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please " });
        }
        const userId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        let deletedAddress = yield db_1.default.address.delete({
            where: {
                id: Number(id),
                userId: Number(userId)
            }
        }).catch(error => { throw Error(error); });
        return res.status(201).json({ message: "deleted succesfully " });
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.deleteAddress = deleteAddress;
const updateShippingAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter Id" });
        }
        const userId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        let newAddress = yield db_1.default.address.findFirst({
            where: {
                id: Number(id)
            },
        });
        if (newAddress.shippingAddressType === "DEFAULT") {
            let updatedAddress = yield db_1.default.address.update({
                where: {
                    id: Number(id)
                },
                data: {
                    shippingAddressType: "NOTDEFAULT"
                }
            });
            return res.status(201).json({ message: "Address Updated", newAddress });
        }
        else {
            let updatedAddress = yield db_1.default.address.update({
                where: {
                    id: Number(id)
                },
                data: {
                    shippingAddressType: "DEFAULT"
                }
            });
            return res.status(201).json({ message: "Address Updated", newAddress });
        }
    }
    catch (error) {
        res.status(520).json(error);
    }
});
exports.updateShippingAddress = updateShippingAddress;
//# sourceMappingURL=address.controller.js.map