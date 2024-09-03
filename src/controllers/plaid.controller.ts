import { Request, Response } from "express";
import { client } from "../plaid/plaid";
import { Products, CountryCode } from "plaid";
import prisma from "../db/db";
export const createLinkToken = async (req: Request, res: Response) => {
    try {

        const userId = Number(res.locals?.user?.id);
        const response = await client.linkTokenCreate({
            user: { client_user_id: `user-${userId}` },
            client_name: 'Pmm',
            products: [Products.Auth],
            country_codes: [CountryCode.Us],
            language: 'en',
        });
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const exchangePublicToken = async (req: Request, res: Response) => {
    try {

        const { public_token } = req.body;
        const userId = Number(res.locals?.user?.id);

        const response = await client.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
        if (accessToken) {
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    buyerPaymentMethodVerified: 'TRUE',
                    plaidAccessToken: accessToken
                }
            })
        }
        res.json({ access_token: accessToken, item_id: itemId });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
