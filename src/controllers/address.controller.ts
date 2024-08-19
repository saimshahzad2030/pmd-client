import { Request, Response } from "express"; 
import prisma from "../db/db";
import { addNewAddressType, updateNewAddressType, deleteAddressType } from 'req'; 
import { ShippingAddresstype } from "@prisma/client";


export const addNewAddress = async (req: Request, res: Response) => {
    try {
        const { address,state,city,postalcode,phone,addressType,fullName } = req.body as addNewAddressType;
        if (!address || !state || !city || !postalcode || !phone || !fullName || !addressType) {
            return res.status(400).json({ message: "Submit all fields" })
        }
         
        const userId = res?.locals?.user?.id;
        
        const addressExist = await prisma.address.findFirst({
            where:{
                postalcode:Number(postalcode),
                    city,
                    state,
                    phone,
                    address,
                    addressType,
                    fullName
                    

            }
        })
        if(addressExist){
            return res.status(201).json({ message: "Address already exist"})
            
        }
        else{
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
    }
    catch (error) {
        res.status(520).json(error)
    }
}


export const updateAddress = async (req: Request, res: Response) => {
    try {
        const {shippingAddressType ,address,state,city,postalcode,phone,addressType,fullName,id } = req.body as updateNewAddressType;
        if (!address || !state || !city || !postalcode || !phone || !fullName || !addressType || !id ) {
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
                fullName,
                shippingAddressType:shippingAddressType as ShippingAddresstype
                
                

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
                id:Number(id),
                userId:Number(userId)
            }
           
        }).catch(error=>{ throw Error(error)})

        return res.status(201).json({ message: "deleted succesfully " })
    }
    catch (error) {
        res.status(520).json(error)
    }
}
export const updateShippingAddress = async (req: Request, res: Response) => {
    try {
        const {id } = req.query;
        if (!id ) {
            return res.status(400).json({ message: "Enter Id" })
        }
         
        const userId = res?.locals?.user?.id;
        
        let newAddress = await prisma.address.findFirst({
            where:{
                id:Number(id)
            },
            
        }) 
        if(newAddress.shippingAddressType ==="DEFAULT"){
            let updatedAddress = await prisma.address.update({
                where:{
                    id:Number(id)
                },
                data:{
                     shippingAddressType:"NOTDEFAULT"
                }
                
            }) 
        return res.status(201).json({ message:  "Address Updated", newAddress })

        }
        else{
            let updatedAddress = await prisma.address.update({
                where:{
                    id:Number(id)
                },
                data:{
                     shippingAddressType:"DEFAULT"
                }
                
            }) 
        return res.status(201).json({ message:  "Address Updated", newAddress })
        }
    }
    catch (error) {
        res.status(520).json(error)
    }
}
