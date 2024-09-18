import { Request, Response } from "express";
import { client } from "../plaid/plaid";
import { Products, CountryCode } from "plaid";
import prisma from "../db/db";
import config from "../config";
import { PaymentVerified } from "@prisma/client";

export const getSessionStatus = async (req: Request, res: Response) => {
    try {
        const userId = Number(res.locals?.user?.id);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        let response2;
        if (user.plaidIdVerificationAccessToken) {
            response2 = await client.identityVerificationGet({
                identity_verification_id: user.plaidIdVerificationAccessToken
            })

        }
        res.json({ status: response2.data.status });
    } catch (error) {
        console.log(error.messaage)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
export const createLinkToken = async (req: Request, res: Response) => {
    try {

        const userId = Number(res.locals?.user?.id);
        const response = await client.linkTokenCreate({
            user: { client_user_id: `customer-${userId}` },
            client_name: 'Pmm',
            products: [Products.Auth],
            country_codes: [CountryCode.Us],
            language: 'en',
        });
        const userObject = { client_user_id: `customer-${userId}`, email_address: res.locals?.user?.email };
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        let response2;
        if (user.plaidIdVerificationAccessToken) {
            response2 = await client.identityVerificationGet({
                identity_verification_id: user.plaidIdVerificationAccessToken
            })

            console.log("verificationStatus:", response2.data.status)
        }

        const tokenResponse = await client.linkTokenCreate({
            user: userObject,
            products: [Products.IdentityVerification],
            identity_verification: {
                template_id: config.TEMPLATE_ID,
            },
            client_name: "Pmm",

            language: "en",
            country_codes: [CountryCode.Us],
        });
        res.json({ response: tokenResponse.data, link_token: response.data.link_token, id_verification_token: tokenResponse.data.link_token, verificationStatus: response2?.data?.status ? response2?.data?.status : null });
    } catch (error) {
        console.log(error.messaage)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
export const exchangePublicToken = async (req: Request, res: Response) => {
    try {

        const { public_token } = req.body;
        console.log("public token from bank: ", public_token)


        const userId = Number(res.locals?.user?.id);

        const response = await client.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
        if (!accessToken) throw new Error("Plaid token exchange failed");

        let updatedUser;
        if (accessToken) {
            updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    plaidAccessToken: accessToken
                }
            })
            if (updatedUser.plaidIdVerificationAccessToken) {
                updatedUser = await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        buyerPaymentMethodVerified: PaymentVerified.TRUE
                    }
                })
            }
        }

        console.log(public_token, "public Token")
        console.log(accessToken, "access Token")
        res.json({ access_token: accessToken, item_id: itemId, updatedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const exchangeIdVerificationToken = async (req: Request, res: Response) => {
    try {


        const { public_token } = req.body;
        console.log('public Token: ', public_token)

        const userId = Number(res.locals?.user?.id);

        const response = await client.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = response.data.access_token;
        console.log(response.data)
        if (!accessToken) throw new Error("Plaid token exchange failed");

        let updatedUser;
        if (accessToken) {
            updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    plaidIdVerificationAccessToken: accessToken
                }
            })
            if (updatedUser.plaidAccessToken) {
                updatedUser = await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        buyerPaymentMethodVerified: PaymentVerified.TRUE
                    }
                })
            }
        }
        console.log(accessToken, "accessToken")
        res.json({ access_token: accessToken, updatedUser });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
