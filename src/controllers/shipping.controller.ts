import { ShippingArrangement, ShippingStatus } from "@prisma/client";
import prisma from "../db/db";
import { Request,Response } from "express";
import { messaging } from "firebase-admin";
export const fetchShipments = async (req: Request, res: Response) => {
    try {
        const userId = Number(res.locals.user.id)
        console.log(userId)
         const shipments = await prisma.order.findMany({
            where:{
                senderId:userId
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
        res.status(200).json({message:'Shipments fetched',shipments})
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
export const updateShippingArrangements = async (req: Request, res: Response) => {
    try {
        
        const status = req.body.status as ShippingArrangement
        const id = Number(req.body.id) 
        if(!status || !id){
            return res.status(400).json({message:"Enter all fields"})
        }
        const userId = Number(res.locals.user.id)
        console.log(userId)
         const updatedShipment = await prisma.shippings.update({
            where:{
                id
            },
            data:{
                arrangementStatus:status
            }
            ,
            include:{
                
            }
        })
        res.status(200).json({message:'Shipments fetched',updatedShipment})
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};