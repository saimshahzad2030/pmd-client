import { Request, Response } from "express";
import prisma from "../db/db";
import {  placeOrderType } from '../types/req';  
 import { stripe } from "../stripe/stripe";
 import config from "../config";
 
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
        const formattedOrderPlacedDate = new Date(orderPlacedDate).toISOString();
        const formattedOrderExpectedDate = new Date(orderExpectedDate).toISOString();
        const paymentIntent = await stripe.paymentIntents.create({
            amount:10000,
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
          console.log(paymentIntent)
        const newShipping = await prisma.order.create({
            data: {
                 productId,
                recieverId,
                senderId,
                orderExpectedDate:formattedOrderPlacedDate,
                orderPlacedDate:formattedOrderPlacedDate,
                price,
                quantity,
                messageForSeller,
                metalAuthenticaitonService,
                paymentMethod,
                paymentIntentId:paymentIntent.id,
                Shippings:{
                    create:{
                        cost:shippingCost,
                        ShippingNotifications:{
                            create:{notificationText:"dsadasdsd",userId:recieverId}
                        }
                    }
                }

            }
        }); 
        console.log(newShipping)

        res.status(201).json({ message: "Order placed successfully",newShipping,clientSecret: paymentIntent});
       
        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });
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


