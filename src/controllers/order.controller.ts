import { Request, Response } from "express";
import prisma from "../db/db";
import {  placeOrderType } from '../types/req';  
 import { stripe } from "../stripe/stripe";
 import config from "../config";
 import {client} from '../plaid/plaid'
 import { CountryCode } from "plaid";
 export const addNewOrder = async (req: Request, res: Response) => {
   try {
     const { productId,
            quantity,
            price,
            orderPlacedDate,
            orderExpectedDate, 
            senderId,
            paymentMethod,
            messageForSeller,
            metalAuthenticaitonService,
            shippingCost } = req.body as placeOrderType; 
            
            if (!orderExpectedDate ) {
            return res.status(400).json({ message: "orderExpectedDate fields are required" });
          } 
          if(  !quantity  )
            {
              
        return res.status(400).json({ message: "quantity fields are required" });
      }
    if(  !orderPlacedDate )
      {
        
        return res.status(400).json({ message: "orderPlacedDate fields are required" });
      }
      if(   !paymentMethod  )
        {
          
          return res.status(400).json({ message: "paymentMethod fields are required" });
        }
        if( !messageForSeller   )
          {
            
            return res.status(400).json({ message: "messageForSeller fields are required" });
          }
          if(   !metalAuthenticaitonService  )
        {
          
          return res.status(400).json({ message: "metalAuthenticaitonService fields are required" });
        }
        if( !price   )
          {
         
            return res.status(400).json({ message: "price fields are required" });
     }
     if(  !shippingCost  )
        {
          
          return res.status(400).json({ message: "shippingCost required" });
        }
        if(  !senderId )
          {
            
            return res.status(400).json({ message: "senderId required" });
          } 
    const sender = await prisma.user.findFirst({
      where:{
        id:senderId,
        
            }
          })
          const recieverId = Number(res.locals?.user.id); 
          const reciever = await prisma.user.findFirst({
            where:{
              id:recieverId,
              
            }
          })
          
          const formattedOrderPlacedDate = new Date(orderPlacedDate).toISOString();
          const formattedOrderExpectedDate = new Date(orderExpectedDate).toISOString();
          const userAgent = req.headers['user-agent'] || 'Unknown';
          let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
          
          if (Array.isArray(userIP)) {
            userIP = userIP[0];
          }
          
          const access_token = reciever.plaidAccessToken
          const response = await client.authGet({
            access_token
          });
        const accountNumbers = response.data.numbers.ach.map(account => ({
          account_id: account.account_id,
          account_number: account.account,
          routing_number: account.routing,
          wire_routing: account.wire_routing,
        }));
        console.log('account numbers: ',accountNumbers)
        // console.log(response.data.item.institution_id)
        const accountDetails = response.data.accounts;  // This will give you the bank account details
    
        const institutions = await client.institutionsGetById({
          institution_id: response.data.item.institution_id,
          country_codes: [CountryCode.Us],
        });
      
        const bankName = institutions.data.institution.name; 
        let paymentMethodUser;
        if(config.PLAID_ENV!='sandbox'){ 

        paymentMethodUser = await stripe.paymentMethods.create({
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
          stripeAccount: config.STRIPE_ACCOUNT_ID  
        });
      }
    
    
        let paymentIntent;
        if (typeof userIP === 'string') {
          console.log('Full IP Address:', userIP);
     
          if (userIP.startsWith('::ffff:')) {
            const ipv4Address = userIP.split('::ffff:')[1];
            console.log('IPv4 Address:', ipv4Address);
            if(config.PLAID_ENV == 'sandbox'){
              paymentIntent = await stripe.paymentIntents.create({
            amount:price*100,
            currency: 'usd',
            payment_method_types: ['card'],
        payment_method: 'pm_card_visa', 
        confirm:true,
        transfer_data: {
          destination: sender.stripeConnectedAccountId,  
        },
          },  
          {
            stripeAccount:config.STRIPE_ACCOUNT_ID
          });   
            }
            else{

              paymentIntent = await stripe.paymentIntents.create({
                amount: price*100,
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
              },
                {
                  stripeAccount: config.STRIPE_ACCOUNT_ID
                });
            }
          
          } else if (userIP === '::1') { 
            if(config.PLAID_ENV == 'sandbox'){
              paymentIntent = await stripe.paymentIntents.create({
            amount:price*100,
            currency: 'usd',
            payment_method_types: ['card'],
        payment_method: 'pm_card_visa', 
        confirm:true,
        transfer_data: {
          destination: sender.stripeConnectedAccountId,  
        },
          },  
          {
            stripeAccount:config.STRIPE_ACCOUNT_ID
          });   
            } 
           else{
            paymentIntent = await stripe.paymentIntents.create({
              amount: price*100,

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
          },
            {
              stripeAccount: config.STRIPE_ACCOUNT_ID
            });
           }
          } else {
            console.log('IP Address:', userIP);
          }
        } else {
          console.log('No IP address found');
          return res.json({ ip: 'No IP address found' });
        }
        
        const newShipping = await prisma.order.create({
            data: {
                 productId,
                recieverId,
                senderId,
                orderExpectedDate:formattedOrderExpectedDate,
                orderPlacedDate:formattedOrderPlacedDate,
                price:price*100,
                quantity,
                messageForSeller,
                metalAuthenticaitonService,
                paymentMethod,
                paymentIntentId:paymentIntent.id,
                Shippings:{
                    create:{
                        cost:shippingCost,
                        ShippingNotifications:{
                            create:{notificationText:"Order Placed succesfully",userId:recieverId}
                        }
                    }
                }

            }
        }) 
            await prisma.products.update({
                where:{
                    id:Number(productId)
                },
                data:{
                    available:{
                        decrement:quantity
                    }
                }
            }) 
          
            // return res.json({ account_details: accountDetails, accountNumbers, paymentIntent });

        res.status(201).json({ message: "Order placed successfully",newShipping,clientSecret: paymentIntent});
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const fetchOrders = async (req: Request, res: Response) => {
    try {
        const userId = Number(res.locals.user.id)
        console.log(userId)
         const orders = await prisma.order.findMany({
            where:{
                recieverId:userId
            },
            include:{
                Shippings:{
                    include:{
                        ShippingNotifications:true
                    }
                },
                reciever:true,
                sender:true
            }
        })
        res.status(200).json({message:'Orders fetched',orders})
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

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


