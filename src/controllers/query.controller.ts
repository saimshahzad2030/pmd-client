import { Request, Response } from "express";
import prisma from "../db/db";
import { MetalType, productReqType, productReviewType, websiteReviewType } from '../types/req';
import { uploadFile } from "../services/upload-file";
import { stripe } from "../stripe/stripe";
import config from "../config"; 
import { serializeBigInt } from "..//utils/seialize-bigint";
interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer; // Buffer is a built-in Node.js type, not bigint
    size: number;
}
 
export const addQuery = async (req: Request, res: Response) => {
    try {
         const {query,email,phone} = req.body

        if (!query ) {
            return res.status(400).json({ message: "Enter Query" });
        }
        if (!email ) {
            return res.status(400).json({ message: "Enter Email" });
        }
        if (!phone ) {
            return res.status(400).json({ message: "Enter Phone" });
        }
        const userId = Number(res.locals.user.id)
        
        const newQuery = await prisma.query.create({
            data:{
                userId,
                email,
                query,
                phone:Number(phone)
            }
        })
        return res.status(200).json({message:"Query added succesfully",newQuery:serializeBigInt(newQuery)})
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
 