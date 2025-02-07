import { Request, Response } from "express"; 
import prisma from "../db/db";
import { addNewBankAccoutType } from '../types/req'; 
import { serializeBigInt } from "../utils/seialize-bigint";
import { messaging } from "firebase-admin";
 


export const addNewBankAccount = async (req: Request, res: Response) => {
    try {
        const { bankName,accountName,accountNo} = req.body as addNewBankAccoutType;
        if (!bankName || !accountName || !accountNo ) {
            return res.status(400).json({ message: "Submit all fields" })
        }
         
        const userId = res?.locals?.user?.id;
        let bankExist = await prisma.bankAccounts.findFirst({
            where:{ 
                accountNo,
                bankName
            }
             
        }).catch(error=>{console.log(error)})
        if(bankExist){
            return res.status(400).json({message:"Already Exist"})
        }
        let newBankAccount = await prisma.bankAccounts.create({
            data: { 
                userId,
                accountName,
                accountNo,
                bankName
                
                

            }
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message: "New Bank Added", newBankAccount:serializeBigInt(newBankAccount) })
    }
    catch (error) {
        res.status(520).json(error)
    }
}

export const deleteBankAccount = async (req: Request, res: Response) => {
    try {
        const {id} = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please" })
        }
          
        const walletId = Number(id)
        let deletedBank = await prisma.bankAccounts.delete({
            where:{
                id:walletId
            } 
        }).catch(error=>{ throw new Error(error)})
        return res.status(201).json({ message: "Bank Deleted succesfully" })
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error)
    }
}
 