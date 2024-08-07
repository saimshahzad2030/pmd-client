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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db/db"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const feedback_routes_1 = __importDefault(require("./routes/feedback.routes"));
const favourites_routes_1 = __importDefault(require("./routes/favourites.routes"));
const address_routes_1 = __importDefault(require("./routes/address.routes"));
const digital_wallet_routes_1 = __importDefault(require("./routes/digital-wallet.routes"));
const bank_account_routes_1 = __importDefault(require("./routes/bank-account.routes"));
const credit_card_routes_1 = __importDefault(require("./routes/credit-card.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const seialize_bigint_1 = require("./utils/seialize-bigint");
const plaid_1 = require("plaid");
const plaid_2 = require("./plaid/plaid");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.body = buf;
    },
}));
app.use("/api", user_routes_1.default);
app.use("/api", feedback_routes_1.default);
app.use('/api', favourites_routes_1.default);
app.use('/api', address_routes_1.default);
app.use('/api', digital_wallet_routes_1.default);
app.use('/api', credit_card_routes_1.default);
app.use('/api', bank_account_routes_1.default);
app.use('/api', product_routes_1.default);
app.use('/api', cart_routes_1.default);
app.use('/api', order_routes_1.default);
// const port = 3000;
const port = process.env.PORT || 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await bucket.makePublic();
        // bucket.upload('D:/office/pmd-server/src/uploads/DK1A2226.JPG', {
        //   destination: 'uploads/file2.jpg'
        // });
        const users = yield db_1.default.user.findMany({
            include: {
                favourites: {
                    include: {
                        product: true
                    }
                },
                creditCards: true,
                bankAccounts: true,
                digitalWallets: true,
                products: true,
                addresses: true,
                notifications: true,
                cart: {
                    include: {
                        product: true
                    }
                },
                recieverOrders: {
                    include: {
                        Shippings: true
                    }
                },
                senderOrders: {
                    include: {
                        Shippings: true
                    }
                }
            },
        });
        const products = yield db_1.default.products.findMany({
            include: {
                images: true,
                videos: true
            }
        });
        res.json({ users: (0, seialize_bigint_1.serializeBigInt)(users), products: (0, seialize_bigint_1.serializeBigInt)(products), message: 'Fetched successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.post('/api/create-link-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield plaid_2.client.linkTokenCreate({
            user: { client_user_id: req.body.userId },
            client_name: 'Pmm',
            products: [plaid_1.Products.Auth], // List of products
            country_codes: [plaid_1.CountryCode.Us],
            language: 'en',
        });
        res.json({ link_token: response.data.link_token });
    }
    catch (error) {
        console.error('Error creating link token:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map