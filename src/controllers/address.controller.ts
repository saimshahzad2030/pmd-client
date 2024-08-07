import { Request, Response } from "express"; 
import prisma from "../db/db";
import { addNewAddressType, updateNewAddressType, deleteAddressType } from 'req'; 


export const addNewAddress = async (req: Request, res: Response) => {
    try {
        const { address,state,city,postalcode,phone,addressType,fullName } = req.body as addNewAddressType;
        if (!address || !state || !city || !postalcode || !phone || !fullName || !addressType) {
            return res.status(400).json({ message: "Submit all fields" })
        }
         
        const userId = res?.locals?.user?.id;
        
        let newAddress = await prisma.address.create({
            data: { 
                userId, 
                postalcode,
                city,
                state,
                phone,
                address,
                addressType,
                fullName
                
                

            }
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message: "New Address Added", newAddress })
    }
    catch (error) {
        res.status(520).json(error)
    }
}


export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { address,state,city,postalcode,phone,addressType,fullName,id } = req.body as updateNewAddressType;
        if (!address || !state || !city || !postalcode || !phone || !fullName || !addressType) {
            return res.status(400).json({ message: "Submit all fields" })
        }
         
        const userId = res?.locals?.user?.id;
        
        let newAddress = await prisma.address.update({
            where:{
                id
            },
            data: { 
                userId, 
                postalcode,
                city,
                state,
                phone,
                address,
                addressType,
                fullName
                
                

            }
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message:  "Address Updated", newAddress })
    }
    catch (error) {
        res.status(520).json(error)
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Enter id please " })
        }
         
        const userId = res?.locals?.user?.id;
        
        let deletedAddress = await prisma.address.delete({
            where:{
                id:Number(id)
            }
           
        }).catch(error=>{ throw Error(error)})

        return res.status(201).json({ message: "Added deleted succesfully ", deletedAddress })
    }
    catch (error) {
        res.status(520).json(error)
    }
}
