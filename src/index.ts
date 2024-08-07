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
import cors from 'cors'
import bodyParser from 'body-parser';
import { serializeBigInt } from "./utils/seialize-bigint"; 
import { ItemPublicTokenExchangeRequest,SandboxPublicTokenCreateRequest } from 'plaid';
import { Products,CountryCode } from 'plaid';
import { client } from './plaid/plaid';
 const app = express();
app.use(cors())
app.use(
  bodyParser.json({
    verify: (req:Request, res:Response, buf) => {
      req.body = buf;
    },
  })
);
app.use("/api", userRoutes);
app.use("/api", feedbackRoutes);
app.use('/api',favouriteRoutes)
app.use('/api',addressRoutes)
app.use('/api',digitalWalletRoutes)
app.use('/api',creditCardRoutes)
app.use('/api',bankAccountRoutes)
app.use('/api',productRoutes)
app.use('/api',cartRoutes)
app.use('/api',orderRoutes) 
// const port = 3000;
 
const port = process.env.PORT || 3000; 
app.get('/', async (req: Request, res: Response) => {
    try {
      // await bucket.makePublic();
      // bucket.upload('D:/office/pmd-server/src/uploads/DK1A2226.JPG', {
      //   destination: 'uploads/file2.jpg'
      // });

      const users = await prisma.user.findMany({
        include: {
          favourites: {
            include: {
              product:true
            }
          },
          creditCards:true,
          bankAccounts:true,
          digitalWallets:true,
          products: true,
          addresses: true, 
          notifications:true,
          cart:{
            include:{
              product:true
            }
          },
          recieverOrders:{
            include:{
              Shippings:true
            }
          },
          senderOrders:{
            include:{
              Shippings:true
            }
          }
        },
      });
      const products = await prisma.products.findMany({
        include:{
          images:true,
          videos:true
        }
        });
      res.json({ users: serializeBigInt(users),products:serializeBigInt(products), message: 'Fetched successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } 
  });
  
  app.post('/api/create-link-token', async (req: Request, res: Response) => {
    try {
      const response = await client.linkTokenCreate({
        user: { client_user_id: req.body.userId },
        client_name: 'Pmm',
        products: [Products.Auth], // List of products
        country_codes: [CountryCode.Us],
        language: 'en',
      });
      res.json({ link_token: response.data.link_token });
    } catch (error) {
      console.error('Error creating link token:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.listen(port, () => { 
  
  console.log(`Server is running on http://localhost:${port}`); 
});
