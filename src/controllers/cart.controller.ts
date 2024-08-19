import { Request, Response } from "express";
import prisma from "../db/db";
import { productReviewType, websiteReviewType } from "req";


export const addToCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Id not provided" });
        }

        const userId = Number(res?.locals?.user.id);
        const product = await prisma.products.findFirst({
            where: {
                id: Number(id),
                sellerId:{
                    not:userId
                }
            }
        })
        if (product) {
            let productAlreadyExist = await prisma.cart.findFirst({
                where: {
                    productId: Number(id),
                    userId:userId
                }
            })
            console.log(productAlreadyExist)

            if (productAlreadyExist) {
                return res.status(400).json({ message: "product already in the cart" })

            }
            let cartItem = await prisma.cart.create({
                data: {
                    productId:Number(id),
                    userId

                }
            }).catch(error => { console.log(error) })

            return res.status(201).json({ message: "Added new item to cart ", cartItem })
        }
        return res.status(400).json({ message: "You cannot add Your own product to cart" })

    }
    catch (error) {
        res.status(520).json(error)
    }
}



export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Id not provided" });
        }

        const userId = Number(res.locals.user.id);

        let deletedProduct = await prisma.cart.delete({
            where: {
                id: Number(id),
                userId
            }

        }).catch(error => { console.log(error) })

        return res.status(201).json({ message: "product removed from cart succesfully ", deletedProduct })



    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};



export const fetchCartItems = async (req: Request, res: Response) => {
    try {
         
        const userId = Number(res.locals.user.id);

        let cartItems = await prisma.cart.findMany({
            where: {
                userId 
            },
            include:{
                product:{
                    include:{
                        images:true,
                        Specifications:true,
                        productHighlights:true,
                        videos:true
                    }
                },
                user:true
            }

        }) 

        return res.status(201).json({ message: "Cart item fetched succesfully", cartItems })



    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

