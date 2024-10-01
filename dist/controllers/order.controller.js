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
exports.fetchOrders = exports.addNewOrder = void 0;
const db_1 = __importDefault(require("../db/db"));
const stripe_1 = require("../stripe/stripe");
const config_1 = __importDefault(require("../config"));
const plaid_1 = require("../plaid/plaid");
const plaid_2 = require("plaid");
const addNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity, price, orderPlacedDate, orderExpectedDate, senderId, paymentMethod, messageForSeller, metalAuthenticaitonService, shippingCost } = req.body;
        if (!orderExpectedDate) {
            return res.status(400).json({ message: "orderExpectedDate fields are required" });
        }
        if (!quantity) {
            return res.status(400).json({ message: "quantity fields are required" });
        }
        if (!orderPlacedDate) {
            return res.status(400).json({ message: "orderPlacedDate fields are required" });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: "paymentMethod fields are required" });
        }
        if (!messageForSeller) {
            return res.status(400).json({ message: "messageForSeller fields are required" });
        }
        if (!metalAuthenticaitonService) {
            return res.status(400).json({ message: "metalAuthenticaitonService fields are required" });
        }
        if (!price) {
            return res.status(400).json({ message: "price fields are required" });
        }
        if (!shippingCost) {
            return res.status(400).json({ message: "shippingCost required" });
        }
        if (!senderId) {
            return res.status(400).json({ message: "senderId required" });
        }
        const sender = yield db_1.default.user.findFirst({
            where: {
                id: senderId,
            }
        });
        const recieverId = Number((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user.id);
        const reciever = yield db_1.default.user.findFirst({
            where: {
                id: recieverId,
            }
        });
        const formattedOrderPlacedDate = new Date(orderPlacedDate).toISOString();
        const formattedOrderExpectedDate = new Date(orderExpectedDate).toISOString();
        const userAgent = req.headers['user-agent'] || 'Unknown';
        let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        if (Array.isArray(userIP)) {
            userIP = userIP[0];
        }
        const access_token = reciever.plaidAccessToken;
        const response = yield plaid_1.client.authGet({
            access_token
        });
        const accountNumbers = response.data.numbers.ach.map(account => ({
            account_id: account.account_id,
            account_number: account.account,
            routing_number: account.routing,
            wire_routing: account.wire_routing,
        }));
        console.log('account numbers: ', accountNumbers);
        // console.log(response.data.item.institution_id)
        const accountDetails = response.data.accounts; // This will give you the bank account details
        const institutions = yield plaid_1.client.institutionsGetById({
            institution_id: response.data.item.institution_id,
            country_codes: [plaid_2.CountryCode.Us],
        });
        const bankName = institutions.data.institution.name;
        let paymentMethodUser;
        if (config_1.default.PLAID_ENV != 'sandbox') {
            paymentMethodUser = yield stripe_1.stripe.paymentMethods.create({
                type: 'us_bank_account',
                us_bank_account: {
                    account_number: accountNumbers[0].account_number,
                    routing_number: accountNumbers[0].routing_number,
                    account_holder_type: 'individual',
                },
                billing_details: {
                    name: reciever.firstName,
                },
            }, {
                stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
            });
        }
        let paymentIntent;
        if (typeof userIP === 'string') {
            console.log('Full IP Address:', userIP);
            if (userIP.startsWith('::ffff:')) {
                const ipv4Address = userIP.split('::ffff:')[1];
                console.log('IPv4 Address:', ipv4Address);
                if (config_1.default.PLAID_ENV == 'sandbox') {
                    paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                        amount: price * 100,
                        currency: 'usd',
                        payment_method_types: ['card'],
                        payment_method: 'pm_card_visa',
                        confirm: true,
                        transfer_data: {
                            destination: sender.stripeConnectedAccountId,
                        },
                    }, {
                        stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
                    });
                }
                else {
                    paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                        amount: price * 100,
                        currency: 'usd',
                        payment_method_types: ['us_bank_account'],
                        payment_method: paymentMethodUser.id,
                        mandate_data: {
                            customer_acceptance: {
                                type: 'online',
                                online: {
                                    ip_address: ipv4Address,
                                    user_agent: userAgent,
                                },
                            },
                        },
                        confirm: true,
                        transfer_data: {
                            destination: sender.stripeConnectedAccountId,
                        },
                    }, {
                        stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
                    });
                }
            }
            else if (userIP === '::1') {
                if (config_1.default.PLAID_ENV == 'sandbox') {
                    paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                        amount: price * 100,
                        currency: 'usd',
                        payment_method_types: ['card'],
                        payment_method: 'pm_card_visa',
                        confirm: true,
                        transfer_data: {
                            destination: sender.stripeConnectedAccountId,
                        },
                    }, {
                        stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
                    });
                }
                else {
                    paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                        amount: price * 100,
                        currency: 'usd',
                        payment_method_types: ['us_bank_account'], // Use 'us_bank_account' for bank accounts
                        payment_method: paymentMethodUser.id,
                        mandate_data: {
                            customer_acceptance: {
                                type: 'online',
                                online: {
                                    ip_address: '127.0.0.1', // Replace with the actual customer's IP address
                                    user_agent: userAgent, // Replace with the actual user's browser user agent
                                },
                            },
                        },
                        confirm: true,
                        transfer_data: {
                            destination: sender.stripeConnectedAccountId,
                        },
                    }, {
                        stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
                    });
                }
            }
            else {
                console.log('IP Address:', userIP);
            }
        }
        else {
            console.log('No IP address found');
            return res.json({ ip: 'No IP address found' });
        }
        const newShipping = yield db_1.default.order.create({
            data: {
                productId,
                recieverId,
                senderId,
                orderExpectedDate: formattedOrderExpectedDate,
                orderPlacedDate: formattedOrderPlacedDate,
                price: price * 100,
                quantity,
                messageForSeller,
                metalAuthenticaitonService,
                paymentMethod,
                paymentIntentId: paymentIntent.id,
                Shippings: {
                    create: {
                        cost: shippingCost,
                        ShippingNotifications: {
                            create: { notificationText: "Order Placed succesfully", userId: recieverId }
                        }
                    }
                }
            }
        });
        yield db_1.default.products.update({
            where: {
                id: Number(productId)
            },
            data: {
                available: {
                    decrement: quantity
                }
            }
        });
        // return res.json({ account_details: accountDetails, accountNumbers, paymentIntent });
        res.status(201).json({ message: "Order placed successfully", newShipping, clientSecret: paymentIntent });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.addNewOrder = addNewOrder;
const fetchOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        console.log(userId);
        const orders = yield db_1.default.order.findMany({
            where: {
                recieverId: userId
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
        res.status(200).json({ message: 'Orders fetched', orders });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchOrders = fetchOrders;
// export const removeProduct = async (req: Request, res: Response) => {
//     try {
//          const {id} = req.query;
//         if (!id ) {
//             return res.status(400).json({ message: "Id not provided" });
//         } 
//         const userId =Number(res.locals.user.id);
//         await prisma.images.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         await prisma.videos.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         await prisma.specifications.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         await prisma.highlights.deleteMany({
//             where:{
//                 productId:Number(id)
//             }
//         })
//         let deletedProduct = await prisma.products.delete({
//             where:{
//                 id:Number(id),
//                 sellerId:userId
//             },
//         }).catch(error=>{console.log(error)})
//         return res.status(201).json({ message: "Product deleted succesfully ", deletedProduct })
//     } catch (error) {
//         res.status(500).json({ error: `Internal Server Error: ${error.message}` });
//     }
// };
//# sourceMappingURL=order.controller.js.map