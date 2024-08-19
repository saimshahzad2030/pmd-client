import { Request, Response } from "express"; 
import prisma from "../db/db";
import {  addNewDigitalWalletType, deleteAddressType } from 'req';
import { error } from 'console';
import { serializeBigInt } from "../utils/seialize-bigint";
 


export const addNewWallet = async (req: Request, res: Response) => {
    try {
        const { accountNumber,walletName,email} = req.body as addNewDigitalWalletType;
        if (!email || !accountNumber || !walletName) {
            return res.status(400).json({ message: "Submit all fields" })
        }
         
        const userId = res?.locals?.user?.id;
        let exist = await prisma.digitalWallets.findFirst({
            where:{ 
                accountNumber, 
                email
            }
             
        }).catch(error=>{console.log(error)})
        if(exist){
            return res.status(400).json({message:"Already Exist"})
        }
        let newDigitalWallet = await prisma.digitalWallets.create({
            data: { 
                userId,
                email,
                walletName,
                accountNumber
                
                

            }
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message: "New Wallet Added", newDigitalWallet:serializeBigInt(newDigitalWallet) })
    }
    catch (error) {
        res.status(520).json(error)
    }
}

export const deleteWallet = async (req: Request, res: Response) => {
    try {
        const {id} = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please" })
        }
          
        const walletId = Number(id)
        let deletedDigitalWallet = await prisma.digitalWallets.delete({
            where:{
                id:walletId
            } 
        }).catch(error=>{ throw new Error(error)})
        return res.status(201).json({ message: "Wallet Deleted succesfully" })
    }
    catch (error) {
        console.log(error);
        res.status(520).send(error)
    }
}
 