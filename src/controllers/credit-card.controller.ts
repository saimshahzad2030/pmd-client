import { Request, Response } from "express"; 
import prisma from "../db/db";
import { addNewCreditCardType } from '../types/req'; 
import { serializeBigInt } from "../utils/seialize-bigint";
 


export const addNewCard = async (req: Request, res: Response) => {
    try {
        const { cardNumber,nameOnCard,expiryDate,cvv} = req.body as addNewCreditCardType;
        if (!expiryDate || !cvv || !nameOnCard || !cardNumber) {
            return res.status(400).json({ message: "Submit all fields" })
        }
         
        const userId = res?.locals?.user?.id;
        let exist = await prisma.creditCards.findFirst({
            where:{ 
                cardNumber, 
                nameOnCard,
            }
             
        }).catch(error=>{console.log(error)})
        if(exist){
            return res.status(400).json({message:"Already Exist"})
        }
        let newCreditCard = await prisma.creditCards.create({
            data: { 
                userId,
                cardNumber,
                cvv,
                nameOnCard,
                expiryDate
                
                

            }
        }).catch(error=>{console.log(error)})
         
        return res.status(201).json({ message: "New Card Added", newCreditCard:serializeBigInt(newCreditCard) })
    }
    catch (error) {
        console.log(error)
        res.status(520).json(error)
    }
}

export const deleteCard = async (req: Request, res: Response) => {
    try {
        const {id} = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please" })
        }
          
        const walletId = Number(id)
        let deletedCard = await prisma.creditCards.delete({
            where:{
                id:walletId
            } 
        }).catch(error=>{ throw new Error(error)})
        return res.status(201).json({ message: "Card Deleted succesfully" })
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error)
    }
}
 