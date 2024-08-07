import { Request, Response } from "express";
import prisma from "../db/db";
import {  placeOrderType } from 'req';  
 
 
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
        // if (!description ) {

        if (!orderExpectedDate || !quantity || !orderPlacedDate || !paymentMethod ||  !messageForSeller || !metalAuthenticaitonService || !price ||  !shippingCost || !senderId  ) {
            return res.status(400).json({ message: "All fields are required" });
        } 
       
  
        console.log(req.body)
       
        const recieverId = Number(res.locals?.user.id); 
        const formattedOrderPlacedDate = new Date(orderPlacedDate).toISOString();
        const formattedOrderExpectedDate = new Date(orderExpectedDate).toISOString();
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
        res.status(201).json({ message: "Order placed successfully",newShipping});
       
        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

// export const fetchProducts = async (req: Request, res: Response) => {
//     try {
//          const products = await prisma.products.findMany({
//             include:{
//                 images:true,
//                 Specifications:true,
//                 productHighlights:true,
//                 videos:true
//             }
//         })
//         res.status(200).json({message:'Produst fetched',products})
//     } catch (error) {
//         res.status(500).json({ error: `Internal Server Error: ${error.message}` });
//     }
// };

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


