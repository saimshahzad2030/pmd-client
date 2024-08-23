import { Request, Response } from "express";
import prisma from "../db/db";
import { productReviewType, websiteReviewType } from "../types/req";


export const addProductFeedback = async (req: Request, res: Response) => {
    try {
        const { review, ratings, productId } = req.body as productReviewType;
        if (!review) {
            return res.status(400).json({ message: "Enter review" })
        }
        if (!ratings) {
            return res.status(400).json({ message: "Rate the product please" })
        }
        if (!productId) {
            return res.status(400).json({ message: "Enter Product Id please" })
        }
        const userId = res?.locals?.user;

        let feedback = await prisma.productReviews.create({
            data: {
                review,
                userId: userId.id,
                ratings,
                productId

            }
        }).catch(error => { console.log(error) })

        return res.status(201).json({ message: "Successfully added new Review ", feedback })
    }
    catch (error) {
        res.status(520).json(error)
    }
}


export const addWebAppFeedback = async (req: Request, res: Response) => {
    try {
        const { review, ratings } = req.body as websiteReviewType;
        if (!review) {
            return res.status(400).json({ message: "Enter review" })
        }
        if (!ratings) {
            return res.status(400).json({ message: "Rate the Website please" })
        }
        const userId = res?.locals?.user.id;


        let feedback = await prisma.websiteReviews.create({
            data: {
                review,
                userId: userId,
                ratings

            },
            include: {
                user: true
            }
        })

        return res.status(201).json({ message: "Successfully added new Review ", feedback })
    }
    catch (error) {
        res.status(520).json(error)
    }

}

export const fetchWebAppFeedbacks = async (req: Request, res: Response) => {
    try {
        const { start, end } = req.query;
        if (!start) {
            return res.status(400).json({ message: "Enter Start of reviews" })
        }
        if (!end) {
            return res.status(400).json({ message: "Start end of reviews" })
        }

        const startIndex = Number(start);
        const endIndex = Number(end);

        const websiteFeedbacks = await prisma.websiteReviews.findMany({
            skip: startIndex,
            take: endIndex - startIndex,
            include: {
                user: true
            }
        });

        const totalReviews = await prisma.websiteReviews.count();

        return res.status(201).json({ message: "Fetched successfully", websiteFeedbacks, totalReviews })
    }
    catch (error) {
        res.status(520).json(error)
    }

}

export const fetchProductsFeedbacks = async (req: Request, res: Response) => {
    try {
        const { start, end } = req.query;
        if (!start) {
            return res.status(400).json({ message: "Enter Start of reviews" })
        }
        if (!end) {
            return res.status(400).json({ message: "Start end of reviews" })
        }


        const startIndex = Number(start);
        const endIndex = Number(end);

        const productFeedbacks = await prisma.productReviews.findMany({
            skip: startIndex,
            take: endIndex - startIndex,
            include: {
                user: true
            }
        });

        const totalReviews = await prisma.productReviews.count();

        return res.status(201).json({ message: "Fetched successfully", productFeedbacks, totalReviews })
    }
    catch (error) {
        res.status(520).json(error)
    }

}