import express, { Request, Response } from 'express';
import prisma from './db/db'
import userRoutes from './routes/user.routes';
import feedbackRoutes from './routes/feedback.routes';
import favouriteRoutes from './routes/favourites.routes'
import addressRoutes from './routes/address.routes'
import digitalWalletRoutes from './routes/digital-wallet.routes'
import bankAccountRoutes from './routes/bank-account.routes'
import creditCardRoutes from './routes/credit-card.routes'
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes'
import orderRoutes from './routes/order.routes'
import shippingRoutes from './routes/shipping.routes'
import cors from 'cors'
import bodyParser from 'body-parser';
import { serializeBigInt } from "./utils/seialize-bigint";
import { ItemPublicTokenExchangeRequest, SandboxPublicTokenCreateRequest } from 'plaid';
import { Products, CountryCode } from 'plaid';
import { client } from './plaid/plaid';
import { generateOtp } from './services/generate-token';
import { stripe } from './stripe/stripe';
import { error } from 'console';
import { messaging } from 'firebase-admin';
import config from './config';
const app = express();
app.use(cors())
app.use(
  bodyParser.json({
    verify: (req: Request, res: Response, buf) => {
      req.body = buf;
    },
  })
);
app.use("/api", userRoutes);
app.use("/api", feedbackRoutes);
app.use('/api', favouriteRoutes)
app.use('/api', addressRoutes)
app.use('/api', digitalWalletRoutes)
app.use('/api', creditCardRoutes)
app.use('/api', bankAccountRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', orderRoutes)
app.use('/api', orderRoutes)
app.use('/api', shippingRoutes)
// const port = 3000;

const port = process.env.PORT || 3000;
app.get('/', async (req: Request, res: Response) => {
  try {
    // await bucket.makePublic();
    // bucket.upload('D:/office/pmd-server/src/uploads/DK1A2226.JPG', {
    //   destination: 'uploads/file2.jpg'
    // });

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
    // const products = await prisma.products.findMany({
    //   include: {
    //     images: true,
    //     videos: true
    //   }
    // }); 
    res.json({message:"sdasd"})
    // res.json({ users: serializeBigInt(users), products: serializeBigInt(products), message: 'Fetched successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
// app.post('/api/plaid-webhook', async (req: Request, res: Response) => {
//   const plaidEvent = req.body;
//   console.log('Plaid webhook event:', plaidEvent); 
//   res.status(200).send('Webhook received');
// });
app.delete('/connected-account', async (req: Request, res: Response) => {
  try {
    await stripe.accounts.del(req.body.accountId).then(() => {
      res.status(200).send("deleted succesfully")
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.post('/connected-account', async (req: Request, res: Response) => {
  try {
    const account = await stripe.accounts.create({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 
app.post('/onboard-user', async (req: Request, res: Response) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: req.body.accountId,  
      refresh_url: `${config.CLIENT_URL}my-account/my-shop`,
      return_url: `${config.CLIENT_URL}my-account/my-shop`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//adding money to platform
app.post('/add-to-platform', async (req: Request, res: Response) => {
  try {
    const charge = await stripe.charges.create({
      amount: 10000, // Amount should be in cents
      currency: 'usd',
      source: 'tok_visa', // Test card or payment method
      description: 'dasdsadasd',
      
    });


    res.json({ charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/create-charge', async (req: Request, res: Response) => {
  try {
    const charge = await stripe.charges.create({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-transfer', async (req: Request, res: Response) => {
  const { amount, currency, chargeId, destinationAccountId } = req.body;

  try {
    const transferToConnect = await stripe.transfers.create({
      amount: 100, 
      currency: 'usd',
      destination: destinationAccountId, 
    });
    
    // Ensure the source account has sufficient funds
    // Create a charge to fund the source account




    // Perform the transfer
    const transfer = await stripe.transfers.create({
      amount,
      currency,
      // The connected account receiving the funds
      destination: destinationAccountId,
      // source_type: 'card', // This might be necessary if you need to specify the source type

      // You must use the platform’s account ID here
      source_transaction: chargeId,
      // source:sourceId
    })
    res.status(200).json({ transfer })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/p-to-u', async (req: Request, res: Response) => {
  const { amount, currency, chargeId, destinationAccountId } = req.body;

  try {
    const transfer = await stripe.transfers.create({
      amount: 10000, // Amount in cents ($100.00)
      currency: 'usd',
      destination: 'acct_1NuzigGBqBokk6kV', // Your platform account ID (where the funds will go)
     }, {
      stripeAccount: 'acct_1PmsA44hoPFYYYAg', // The connected account ID from which to take funds
    });
    res.status(200).json({ transfer })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/create-transfer', async (req: Request, res: Response) => {

  try {
    const transfers = await stripe.transfers.list({
      limit: 10,
    });
    res.status(200).json(transfers)
  }
  catch (error) {
    res.status(500).json({ error: error.message });

  }
})

app.get('/balance', async (req: Request, res: Response) => {
  try {
    const balance = await stripe.balance.retrieve({
       stripeAccount: req.body.accountId
    });

    return res.status(200).json({ balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    return res.status(520).json({ error: error.message });

  }
}
)

const getBalance = async () => {
  try {
    const balance = await stripe.balance.retrieve();
    console.log('Current balance:', balance);
    return balance;
  } catch (error) {
    console.error('Error retrieving balance:', error);
    throw error;
  }
};
app.post('/payout',async (req:Request,res:Response) => {
  try {
    console.log(req.body.destinationAccountId)
    console.log(req.body.amount*100)
    const payout = await stripe.payouts.create({
      amount: req.body.amount * 100,  
      currency: "usd",
      method: 'standard',
      
      destination: req.body.destinationAccountId,  
    },
    {
      stripeAccount: req.body.connectedAccountId, // Connected account ID
    }); 
    return res.status(200).json({payout});
    // return res.status(200).json({payout:req.body.destinationAccountId});

  } catch (error) {
    return res.status(200).json({error:error.message});

  }
})

app.get('/list-bank-accounts', async (req, res) => { 

  try {
    const bankAccounts = await stripe.accounts.listExternalAccounts(
      req.body.connectedAccountId, // The connected account ID
      { limit: 10 } // Limit the number of results returned
    );

    res.status(200).json({ bankAccounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
app.post('/payment', async (req, res) => { 

  try {
    
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, 
  currency: 'usd',
  payment_method_types: ['card'],
  payment_method: 'pm_card_visa', 
  // transfer_data: {
  //   destination: req.body.accountId, 
  // },
  confirm: true,
},{
  stripeAccount:'acct_1PmsA44hoPFYYYAg'
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/create-payment-intent', async (req, res) => {
  try { 
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount:10000,
      currency: 'usd',
      payment_method_types: ['card'],
  payment_method: 'pm_card_visa', 
  confirm:true,
  transfer_data: {
    destination: 'acct_1PmsA44hoPFYYYAg', // connected account ID
  },
    },  
    {
      stripeAccount:'acct_1NuzigGBqBokk6kV'
    });

    res.json({ clientSecret: paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-payment-method', async (req, res) => {
  try {
    const { payment_method_id } = req.body;

    // Optionally, you can attach the payment method to a customer
    // const customer = await stripe.customers.create();
    // await stripe.paymentMethods.attach(payment_method_id, { customer: customer.id });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
app.post('/create-setup-intent', async (req, res) => {
  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  });
  res.json({ clientSecret: setupIntent.client_secret });
});
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

app.post('/create-payment-intent-wallet', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'], // This includes digital wallets
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/confirm-payment-wallet', async (req, res) => {
  try {
    const { clientSecret, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethodId,
    });

    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, async() => { 
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
  console.log(`Server is running on http://localhost:${port}`);
});
