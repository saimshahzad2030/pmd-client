import { Request, Response } from "express"; 
import prisma from "../db/db";
import { addToFavouritesType } from "req";


export const addToFavourites = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body as addToFavouritesType;
        if (!productId) {
            return res.status(400).json({ message: "Enter Product Id plaese" })
        }
         
        const userId = res?.locals?.user.id;
        
        let favourite = await prisma.favourites.create({
            data: { 
                userId, 
                productId

            }
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message: "Added to favourites succesfully ", favourite })
    }
    catch (error) {
        res.status(520).json(error)
    }
}


export const removeFromFavourites = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body as addToFavouritesType;
        if (!productId) {
            return res.status(400).json({ message: "Enter Product Id plaese" })
        }
         
        const userId = res?.locals?.user.id;
        
        let productRemoved = await prisma.favourites.delete({
            where:{
                userId_productId:{
                    userId,
                    productId
                }
            }
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message: "Product removed from favouties succesfully ", productRemoved })
    }
    catch (error) {
        res.status(520).json(error)
    }

} 


export const fetchFavourites = async (req: Request, res: Response) => {
    try {  
         
        const userId = res?.locals?.user.id;
        
        let favourites = await prisma.favourites.findMany({
            where:{
                userId
            },
            include:{
                product:{
                    include:{
                        images:true,
                        Specifications:true,
                        videos:true,
                        productHighlights:true,
                        favourites:true
                    }
                }
            }
        })

        return res.status(201).json({ message: "Favourites fetched succesfully ", favourites })
    }
    catch (error) {
        res.status(520).json(error)
    }
}
