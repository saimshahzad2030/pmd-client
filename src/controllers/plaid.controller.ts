import { Request, Response } from "express";
import { client } from "../plaid/plaid";
import { Products, CountryCode } from "plaid";
import prisma from "../db/db";
import { ResponseMessage } from "@prisma/client";
import config from "../config";
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
        res.json({ link_token: response.data.link_token, id_verification_token: tokenResponse.data.link_token });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
export const exchangePublicToken = async (req: Request, res: Response) => {
    try {

        const { public_token } = req.body;
        console.log("public token from exchangePublicToken: ", public_token)


        const userId = Number(res.locals?.user?.id);

        const response = await client.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
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

        }
        if (updatedUser.imageUrl && updatedUser.licenseImage) {
            updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    verificationMessage: ResponseMessage.UnderGoingVerification
                }
            })
        }
        else {
            updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    verificationMessage: ResponseMessage.DetailsRequired
                }
            })
        }
        res.json({ access_token: accessToken, item_id: itemId, updatedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const exchangeIdVerificationToken = async (req: Request, res: Response) => {
    try {

        const { public_token } = req.body;
        console.log("public token from idV: ", public_token)
        // const userId = Number(res.locals?.user?.id);

        const response = await client.itemPublicTokenExchange({ public_token: public_token });
        const access_token = response.data.access_token;
        // const itemId = response.data.item_id;
        // let updatedUser;
        // if (accessToken) {
        //     updatedUser = await prisma.user.update({
        //         where: {
        //             id: userId
        //         },
        //         data: {
        //             plaidAccessToken: accessToken
        //         }
        //     })

        // }
        // if (updatedUser.imageUrl && updatedUser.licenseImage) {
        //     updatedUser = await prisma.user.update({
        //         where: {
        //             id: userId
        //         },
        //         data: {
        //             verificationMessage: ResponseMessage.UnderGoingVerification
        //         }
        //     })
        // }
        // else {
        //     updatedUser = await prisma.user.update({
        //         where: {
        //             id: userId
        //         },
        //         data: {
        //             verificationMessage: ResponseMessage.DetailsRequired
        //         }
        //     })
        // }
        console.log(response.data)
        res.json({ access_token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
