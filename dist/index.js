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
const shipping_routes_1 = __importDefault(require("./routes/shipping.routes"));
const query_routes_1 = __importDefault(require("./routes/query.routes"));
const plaid_routes_1 = __importDefault(require("./routes/plaid.routes"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const plaid_1 = require("./plaid/plaid");
const stripe_1 = require("./stripe/stripe");
const plaid_2 = require("plaid");
const config_1 = __importDefault(require("./config"));
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
app.use('/api', order_routes_1.default);
app.use('/api', shipping_routes_1.default);
app.use('/api', query_routes_1.default);
app.use('/api', plaid_routes_1.default);
const port = process.env.PORT || 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const products = await prisma.products.findMany({
        //   include: {
        //     images: true,
        //     Specifications: true,
        //     productHighlights: true,
        //     videos: true,
        //     favourites: true,
        //     cart: true
        //   }
        // })
        // const users = await prisma.user.findMany({
        //   include: {
        //     favourites: {
        //       include: {
        //         product: true
        //       }
        //     },
        //     creditCards: true,
        //     bankAccounts: true,
        //     digitalWallets: true,
        //     products: true,
        //     addresses: true,
        //     notifications: true,
        //     cart: {
        //       include: {
        //         product: true
        //       }
        //     },
        //     recieverOrders: {
        //       include: {
        //         Shippings: true
        //       }
        //     },
        //     senderOrders: {
        //       include: {
        //         Shippings: true
        //       }
        //     }
        //   },
        // });
        res.status(200).json({ message: 'Products fetched' });
        // res.status(200).json({ message: 'Products fetched', products: serializeBigInt(users) })
        // res.json({ users: serializeBigInt(users), message: 'Fetched successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
// app.post('/api/create-link-token', async (req: Request, res: Response) => {
//   try {
//     const response = await client.linkTokenCreate({
//       user: { client_user_id: req.body.userId },
//       client_name: 'Pmm',
//       products: [Products.Auth],
//       country_codes: [CountryCode.Us],
//       language: 'en',
//     });
//     res.json({ link_token: response.data.link_token });
//   } catch (error) {
//     console.error('Error creating link token:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
// app.post('/api/exchange-public-token', async (req: Request, res: Response) => {
//   try {
//     const { public_token } = req.body;
//     const response = await client.itemPublicTokenExchange({
//       public_token,
//     });
//     const accessToken = response.data.access_token;
//     const itemId = response.data.item_id;
//     // Save the access token and item ID to your database
//     // e.g., save them to a user's record
//     res.json({ access_token: accessToken, item_id: itemId });
//   } catch (error) {
//     console.error('Error exchanging public token:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
app.post('/api/plaid-webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const plaidEvent = req.body;
    console.log('Plaid webhook event:', plaidEvent);
    res.status(200).send('Webhook received');
}));
// app.get('/get-browser-info', (req, res) => {
//   const userAgent = req.headers['user-agent'] || 'Unknown';
//   let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
//   // Check if userIP is an array
//   if (Array.isArray(userIP)) {
//     userIP = userIP[0];
//   }
//   // Ensure userIP is a string
//   if (typeof userIP === 'string') {
//     console.log('Full IP Address:', userIP);
//     // Check if the IP is an IPv6-mapped IPv4 address
//     if (userIP.startsWith('::ffff:')) {
//       const ipv4Address = userIP.split('::ffff:')[1];
//       console.log('IPv4 Address:', ipv4Address);
//       res.json({ ip: ipv4Address, userAgent });
//     } else if (userIP === '::1') {
//       // Handle the loopback address
//       console.log('IPv6 Loopback Address');
//       res.json({ ip: '127.0.0.1', userAgent });
//     } else {
//       console.log('IP Address:', userIP);
//       res.json({ ip: userIP, userAgent });
//     }
//   } else {
//     console.log('No IP address found');
//     res.json({ ip: 'No IP address found' });
//   }
// });
app.get('/api/get-bank-details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAgent = req.headers['user-agent'] || 'Unknown';
        let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        if (Array.isArray(userIP)) {
            userIP = userIP[0];
        }
        const access_token = 'access-sandbox-48077355-cbe0-414d-a2c5-64a3133e8e12';
        const response = yield plaid_1.client.authGet({
            access_token
        });
        const accountNumbers = response.data.numbers.ach.map(account => ({
            account_id: account.account_id,
            account_number: account.account,
            routing_number: account.routing,
            wire_routing: account.wire_routing,
        }));
        // console.log(response.data.item.institution_id)
        const accountDetails = response.data.accounts; // This will give you the bank account details
        const institutions = yield plaid_1.client.institutionsGetById({
            institution_id: response.data.item.institution_id,
            country_codes: [plaid_2.CountryCode.Us],
        });
        // Extract bank name from institutions response
        const bankName = institutions.data.institution.name;
        console.log("bankName", bankName);
        const paymentMethod = yield stripe_1.stripe.paymentMethods.create({
            type: 'us_bank_account', // Specify the type of payment method
            us_bank_account: {
                account_number: '000123456789', // Replace with actual account number
                routing_number: '110000000', // Replace with actual routing number
                account_holder_type: 'individual', // or 'company' based on the account
            },
            billing_details: {
                name: 'Jane Doe', // Replace with the actual name
            },
        }, {
            stripeAccount: config_1.default.STRIPE_ACCOUNT_ID // Connected account context if applicable
        });
        let paymentIntent;
        if (typeof userIP === 'string') {
            console.log('Full IP Address:', userIP);
            // Check if the IP is an IPv6-mapped IPv4 address
            if (userIP.startsWith('::ffff:')) {
                const ipv4Address = userIP.split('::ffff:')[1];
                console.log('IPv4 Address:', ipv4Address);
                paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                    amount: 200,
                    currency: 'usd',
                    payment_method_types: ['us_bank_account'], // Use 'us_bank_account' for bank accounts
                    payment_method: paymentMethod.id,
                    mandate_data: {
                        customer_acceptance: {
                            type: 'online',
                            online: {
                                ip_address: ipv4Address, // Replace with the actual customer's IP address
                                user_agent: userAgent, // Replace with the actual user's browser user agent
                            },
                        },
                    },
                    confirm: true,
                    transfer_data: {
                        destination: 'acct_1Pus4X4W92HCFc4A',
                    },
                }, {
                    stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
                });
            }
            else if (userIP === '::1') {
                // Handle the loopback address
                console.log('IPv6 Loopback Address');
                paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                    amount: 200,
                    currency: 'usd',
                    payment_method_types: ['us_bank_account'], // Use 'us_bank_account' for bank accounts
                    payment_method: paymentMethod.id,
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
                        destination: 'acct_1Pus4X4W92HCFc4A',
                    },
                }, {
                    stripeAccount: config_1.default.STRIPE_ACCOUNT_ID
                });
            }
            else {
                console.log('IP Address:', userIP);
            }
        }
        else {
            console.log('No IP address found');
            return res.json({ ip: 'No IP address found' });
        }
        return res.json({ account_details: accountDetails, accountNumbers, paymentIntent });
    }
    catch (error) {
        console.error('Error fetching bank details:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.post('/create-verification-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientUserId = String(req.body.clientUserId);
        const response = yield plaid_1.client.identityVerificationCreate({
            client_user_id: clientUserId,
            is_idempotent: true,
            template_id: 'idvtmp_dnGyn66a6WZs65', // Set your template ID
            is_shareable: false, // or true depending on your requirements
            gave_consent: true,
        });
        console.log(response.data);
        // Assuming the correct property in the response is 'data', adjust accordingly
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.error('Error creating verification session', error);
        res.status(500).json({ error: 'Error creating verification session' });
    }
}));
// app.post("/api/generate_link_token_for_idv", async (req, res, next) => {
//   try {
//     const userId = "usaer_sdas";
//     const email = "saimshehzad2030@gmail.com";
//     const userObject = { client_user_id: userId, email_address: email };
//     const tokenResponse = await client.linkTokenCreate({
//       user: userObject,
//       products: [Products.IdentityVerification],
//       identity_verification: {
//         template_id: "idvtmp_98z4wWCMbZZFKp",
//       },
//       client_name: "Precious Market Place",
//       language: "en",
//       country_codes: [CountryCode.Us],
//     });
//     res.json(tokenResponse.data);
//   } catch (error) {
//     console.log(`Running into an error!`);
//     next(error);
//   }
// });
// Endpoint to get verification session status
app.get('/verification-status/:sessionId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.params;
    try {
        const response = yield plaid_1.client.identityVerificationGet({
            identity_verification_id: sessionId,
        });
        console.log(response.data.status);
        res.status(200).json({
            message: 'Verification status retrieved successfully',
            status: response.data.status,
            session: response.data
        });
    }
    catch (error) {
        // console.error('Error retrieving verification status', error);
        res.status(500).json({ error: 'Error retrieving verification status' });
    }
}));
// Webhook endpoint for receiving real-time updates
app.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verification_id, status } = req.body;
    // Handle webhook event
    console.log(`Received webhook for verification ${verification_id} with status ${status}`);
    res.status(200).json({ message: 'Webhook received successfully' });
}));
app.delete('/connected-account', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stripe_1.stripe.accounts.del(req.body.accountId).then(() => {
            res.status(200).send("deleted succesfully");
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/connected-account', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield stripe_1.stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: req.body.email,
            capabilities: {
                transfers: { requested: true },
                card_payments: {
                    requested: true,
                },
            },
        });
        res.json({ accountId: account.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/onboard-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountLink = yield stripe_1.stripe.accountLinks.create({
            account: req.body.accountId,
            refresh_url: `${config_1.default.CLIENT_URL}my-account/my-shop`,
            return_url: `${config_1.default.CLIENT_URL}my-account/my-shop`,
            type: 'account_onboarding',
        });
        res.json({ url: accountLink.url });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//adding money to platform
app.post('/add-to-platform', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const charge = yield stripe_1.stripe.charges.create({
            amount: 10000, // Amount should be in cents
            currency: 'usd',
            source: 'tok_visa', // Test card or payment method
            description: 'dasdsadasd',
        });
        res.json({ charge });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/create-charge', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const charge = yield stripe_1.stripe.charges.create({
            amount: req.body.amount, // Amount should be in cents
            currency: req.body.currency,
            source: req.body.source, // Test card or payment method
            description: req.body.description,
            // on_behalf_of: req.body.destinationAccountId, // The connected account to fund
            // transfer_data: {
            //   destination: req.body.destinationAccountId, // The connected account where funds go
            // },
        });
        res.json({ charge });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/create-transfer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency, chargeId, destinationAccountId } = req.body;
    try {
        const transferToConnect = yield stripe_1.stripe.transfers.create({
            amount: 100,
            currency: 'usd',
            destination: destinationAccountId,
        });
        // Ensure the source account has sufficient funds
        // Create a charge to fund the source account
        // Perform the transfer
        const transfer = yield stripe_1.stripe.transfers.create({
            amount,
            currency,
            // The connected account receiving the funds
            destination: destinationAccountId,
            // source_type: 'card', // This might be necessary if you need to specify the source type
            // You must use the platform’s account ID here
            source_transaction: chargeId,
            // source:sourceId
        });
        res.status(200).json({ transfer });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/p-to-u', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency, chargeId, destinationAccountId } = req.body;
    try {
        const transfer = yield stripe_1.stripe.transfers.create({
            amount: 10000, // Amount in cents ($100.00)
            currency: 'usd',
            destination: 'acct_1NuzigGBqBokk6kV', // Your platform account ID (where the funds will go)
        }, {
            stripeAccount: 'acct_1PmsA44hoPFYYYAg', // The connected account ID from which to take funds
        });
        res.status(200).json({ transfer });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get('/create-transfer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transfers = yield stripe_1.stripe.transfers.list({
            limit: 10,
        });
        res.status(200).json(transfers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get('/balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const balance = yield stripe_1.stripe.balance.retrieve({
            stripeAccount: req.body.accountId
        });
        return res.status(200).json({ balance });
    }
    catch (error) {
        console.error('Error retrieving balance:', error);
        return res.status(520).json({ error: error.message });
    }
}));
const getBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const balance = yield stripe_1.stripe.balance.retrieve();
        console.log('Current balance:', balance);
        return balance;
    }
    catch (error) {
        console.error('Error retrieving balance:', error);
        throw error;
    }
});
app.post('/payout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.destinationAccountId);
        console.log(req.body.amount * 100);
        const payout = yield stripe_1.stripe.payouts.create({
            amount: req.body.amount * 100,
            currency: "usd",
            method: 'standard',
            destination: req.body.destinationAccountId,
        }, {
            stripeAccount: req.body.connectedAccountId, // Connected account ID
        });
        return res.status(200).json({ payout });
        // return res.status(200).json({payout:req.body.destinationAccountId});
    }
    catch (error) {
        return res.status(200).json({ error: error.message });
    }
}));
app.get('/list-bank-accounts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bankAccounts = yield stripe_1.stripe.accounts.listExternalAccounts(req.body.connectedAccountId, // The connected account ID
        { limit: 10 } // Limit the number of results returned
        );
        res.status(200).json({ bankAccounts });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
            amount: 5000,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa',
            // transfer_data: {
            //   destination: req.body.accountId, 
            // },
            confirm: true,
        }, {
            stripeAccount: 'acct_1PmsA44hoPFYYYAg'
        });
        // const paymentMethods = await stripe.paymentMethods.list({stripeAccount:'acct_1PmsHFQFAm3jyZZu'})
        // const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
        //   paymentIntent.id, // Replace with your Payment Intent ID
        //   { payment_method: paymentIntent.payment_method as string} // Replace with your Payment Method ID
        // );
        // const escrowTransfer = await stripe.transfers.create({
        //   amount: 5000, // Amount in cents
        //   currency: 'usd',
        //   destination: 'acct_1NuzigGBqBokk6kV', // Your platform account ID
        //   transfer_group: `ESCROW_${paymentIntent.id}`, // Use the PaymentIntent ID for tracking
        // });
        // console.log(confirmedPaymentIntent);
        res.status(200).json({ paymentIntent });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/create-payment-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
            amount: 10000,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa',
            confirm: true,
            transfer_data: {
                destination: 'acct_1PmsA44hoPFYYYAg', // connected account ID
            },
        }, {
            stripeAccount: 'acct_1NuzigGBqBokk6kV'
        });
        res.json({ clientSecret: paymentIntent });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/create-payment-method', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payment_method_id } = req.body;
        // Optionally, you can attach the payment method to a customer
        // const customer = await stripe.customers.create();
        // await stripe.paymentMethods.attach(payment_method_id, { customer: customer.id });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/create-setup-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const setupIntent = yield stripe_1.stripe.setupIntents.create({
        payment_method_types: ['card'],
    });
    res.json({ clientSecret: setupIntent.client_secret });
}));
// app.post('/create-bank-setup-intent', async (req, res) => {
//   try {
//     const setupIntent = await stripe.setupIntents.create({
//       payment_method_types: ['sepa_debit'], // For SEPA Direct Debit
//       // payment_method_types: ['ach_debit'], // For ACH Direct Debit
//     });
//     res.json({ clientSecret: setupIntent.client_secret  });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.post('/create-payment-method-bank', async (req, res) => {
//   try {
//     const { iban, accountHolderName,ipAddress,userAgent } = req.body;
//     const paymentMethod = await stripe.paymentMethods.create({
//       type: 'sepa_debit',
//       sepa_debit: { iban },
//       billing_details: { name: accountHolderName 
//         ,email: "saimshehzad2030@gmail.com",
//       },
//       mandate_data: {
//         customer_acceptance: {
//           type: 'online',
//           online: {
//             ip_address: ipAddress, // The customer's IP address
//             user_agent: userAgent  // The user's browser user agent
//           }
//         }
//       }
//     });
//     res.json({ paymentMethodId: paymentMethod.id });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.post('/confirm-bank-setup', async (req, res) => {
//   try {
//     const { clientSecret, paymentMethodId,ipAddress,userAgent } = req.body;
//     const setupIntent = await stripe.setupIntents.confirm(clientSecret, {
//       payment_method: paymentMethodId, 
//       payment_method_options:{
//         sepa_debit:{
//         }
//       }
//     });
//     if (setupIntent.status === 'succeeded') {
//       res.json({ success: true });
//     } else {
//       res.status(400).json({ error: 'Verification failed' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// // Endpoint for creating PaymentIntent (for digital wallets)
// app.post('/create-digital-payment-intent', async (req, res) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 5000, // Example amount in cents
//       currency: 'usd',
//       payment_method_types: ['card'], // For digital wallets that use cards
//     });
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
//wallet home
app.post('/create-payment-intent-wallet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
            amount: 1099, // Amount in cents
            currency: 'usd',
            payment_method_types: ['card'], // This includes digital wallets
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/confirm-payment-wallet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientSecret, paymentMethodId } = req.body;
        const paymentIntent = yield stripe_1.stripe.paymentIntents.confirm(clientSecret, {
            payment_method: paymentMethodId,
        });
        res.json(paymentIntent);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post('/abcd', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, details } = req.body;
    try {
        let paymentMethod;
        if (type === 'card') {
            // req.body example for card:
            // {
            //   "type": "card",
            //   "details": {
            //     "number": "4242424242424242",
            //     "exp_month": "12",
            //     "exp_year": "2024",
            //     "cvc": "123"
            //   }
            // }
            paymentMethod = yield stripe_1.stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: details.number,
                    exp_month: details.exp_month,
                    exp_year: details.exp_year,
                    cvc: details.cvc,
                },
            });
        }
        else if (type === 'bank_account') {
            // req.body example for bank account:
            // {
            //   "type": "bank_account",
            //   "details": {
            //     "country": "US",
            //     "currency": "usd",
            //     "account_holder_name": "John Doe",
            //     "account_holder_type": "individual",
            //     "routing_number": "110000000",
            //     "account_number": "000123456789"
            //   }
            // }
            paymentMethod = yield stripe_1.stripe.paymentMethods.create({
                type: 'us_bank_account',
                us_bank_account: {
                    account_holder_type: details.account_holder_type,
                    routing_number: details.routing_number,
                    account_number: details.account_number,
                },
                billing_details: {
                    name: details.account_holder_name,
                },
            });
        }
        else if (type === 'wallet') {
            // req.body example for wallet (e.g., Apple Pay, Google Pay):
            // {
            //   "type": "wallet",
            //   "details": {
            //     "token": "tok_visa"  // token provided by the wallet
            //   }
            // }
            paymentMethod = yield stripe_1.stripe.paymentMethods.create({
                type: 'card',
                card: {
                    token: details.token,
                },
            });
        }
        else {
            return res.status(400).json({ success: false, message: 'Invalid payment method type' });
        }
        res.status(200).json({ success: true, paymentMethod });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}));
app.get('/verificationDetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identity_verification_id } = req === null || req === void 0 ? void 0 : req.query;
        const response = yield plaid_1.client.identityVerificationGet({
            identity_verification_id: String(identity_verification_id)
        });
        // Send the actual response data back to the client
        yield db_1.default.user.update({
            where: { id: 9 },
            data: {
                plaidIdVerificationAccessToken: String(identity_verification_id)
            }
        });
        return res.status(200).json({ status: response.data.status });
    }
    catch (error) {
        console.error('Error fetching identity verification:', error.message);
        // Return the error response to the client
        return res.status(500).json({ error: error.message });
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    // const bankAccounts = await stripe.accounts.listExternalAccounts('acct_1PmsHFQFAm3jyZZu', {
    //   object: 'bank_account',
    // });
    // const cards = await stripe.accounts.listExternalAccounts('acct_1PmsHFQFAm3jyZZu', {
    //   object: 'card',
    // });
    // const balance = await stripe.balance.retrieve({
    //   stripeAccount: 'acct_1NuzigGBqBokk6kV'
    // });
    // console.log('cards',cards)
    // console.log('bank_account',bankAccounts)
    // console.log(balance)
    // const paymentIntent = await stripe.paymentIntents.retrieve('pi_3PnJc7GBqBokk6kV0lqPDmvB');
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentIntent.id,
    //   amount: paymentIntent.amount_received, // You can specify a partial amount here
    // });
    // console.log('Refund Created:', refund);
    // console.log(paymentIntent); 
    console.log(`Server is running on http://localhost:${port} `);
}));
//# sourceMappingURL=index.js.map