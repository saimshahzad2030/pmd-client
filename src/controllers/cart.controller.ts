import { Request, Response } from "express";
import prisma from "../db/db";
import { productReviewType, websiteReviewType } from "req";


export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body as productReviewType;
        if (!productId) {
            return res.status(400).json({ message: "Product id not provided" })
        }

        const userId = res?.locals?.user.id;
        const product = await prisma.products.findFirst({
            where: {
                id: Number(productId)
            }
        })
        if (product.sellerId != Number(res.locals.user.id)) {
            let productAlreadyExist = await prisma.cart.findMany({
                where: {
                    userId: Number(res.locals.user.id)
                }
            })
            if (productAlreadyExist) {
                return res.status(400).json({ message: "product already in the cart" })

            }
            let cartItem = await prisma.cart.create({
                data: {
                    productId,
                    userId

                }
            }).catch(error => { console.log(error) })

            return res.status(201).json({ message: "Added new item to cart ", cartItem })
        }
        return res.status(400).json({ message: "You cannot add your own product to cart " })

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
                id: Number(id)
            }

        }).catch(error => { console.log(error) })

        return res.status(201).json({ message: "product removed from cart succesfully ", deletedProduct })



    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};


