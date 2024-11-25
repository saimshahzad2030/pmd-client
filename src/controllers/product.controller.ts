import { Request, Response } from "express";
import prisma from "../db/db";
import { MetalType, productReqType, productReviewType, websiteReviewType } from '../types/req';
import { uploadFile } from "../services/upload-file";
import { stripe } from "../stripe/stripe";
import config from "../config";
interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer; // Buffer is a built-in Node.js type, not bigint
    size: number;
}

interface Files {
    [fieldname: string]: File[];
}
export const addProduct = async (req: Request, res: Response) => {
    try {
        const { description, specifications, name, available, price, productDetails, productHighlights, metalType } = req.body as productReqType;


        if (!description) {
            return res.status(400).json({ message: "Enter Description" });
        }
        if (!specifications) {
            return res.status(400).json({ message: "Enter specifications" });

        }
        if (!name) {
            return res.status(400).json({ message: "Enter name" });

        }
        if (!available) {
            return res.status(400).json({ message: "Enter available" });

        }
        if (!price) {
            return res.status(400).json({ message: "Enter specifications" });

        }
        if (!productDetails) {
            return res.status(400).json({ message: "Enter productDetails" });

        }
        if (!productHighlights) {
            return res.status(400).json({ message: "Enter productHighlights" });

        }
        if (!metalType) {
            return res.status(400).json({ message: "Enter metalType" });

        }
        if (!req.files) {
            res.status(400).send('No file uploaded.');
            return;
        }

        // console.log(req.body,'req')
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
        const images: Express.Multer.File[] = Array.isArray(files) ? [] : (files['images'] || []);
        const videos: Express.Multer.File[] = Array.isArray(files) ? [] : (files['videos'] || []);
        const imageUrls: string[] = await Promise.all(
            images.map(async (image: File) => {
                return await uploadFile(image, `images`);

            })
        );
        const videoUrls: string[] = await Promise.all(
            videos.map(async (video: File) => {
                return await uploadFile(video, `videos`);
            })
        );
        console.log(productHighlights)
        const sellerId = Number(res.locals?.user.id);
        const newProduct = await prisma.products.create({
            data: {
                name,
                sellerId,
                metalType,
                available: Number(available),
                rating: 4,
                price: Number(price),
                productDetails,
                description,
                images: {
                    create: imageUrls.map(url => ({
                        image: url
                    }))
                },
                videos: {
                    create: videoUrls.map(url => ({
                        video: url
                    }))
                },
                Specifications: {
                    create: specifications.map((specification) => ({
                        specification: specification
                    }))
                },
                productHighlights: {
                    create: Array.isArray(productHighlights)
                        ? productHighlights.map((highlight) => ({
                            highlight: highlight
                        }))
                        : [{ highlight: productHighlights }]
                }

            }
        });


        res.status(201).json({ message: "Product added successfully", newProduct });
        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });

        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const fetchSingleProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.query;

        const product = await prisma.products.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true,
                seller: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        })
        const relatedProducts = await prisma.products.findMany({
            where: {
                id: {
                    not: product.id,
                },
                metalType: product.metalType as MetalType
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true,

            }
        })
        const productReview = await prisma.productReviews.findMany({
            where: {
                productId: Number(id)
            },
            include: {
                user: true,

            }
        })
        res.status(200).json({ message: 'Product fetched', product, relatedProducts, productReview })
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const fetchSingleProductByType = async (req: Request, res: Response) => {
    try {

        const { type } = req.query;


        const relatedProducts = await prisma.products.findMany({
            where: {

                metalType: type as MetalType
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true
            }
        })

        res.status(200).json({ message: 'Product fetched', relatedProducts })
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

// export const fetchRelatedProducts = async (req: Request, res: Response) => {
//     try {

//         const {metalType} = req.query; 
//          const product = await prisma.products.findMany({
//             where:{
//                 metalType:metalType as MetalType
//             },
//             include:{
//                 images:true,
//                 Specifications:true,
//                 productHighlights:true,
//                 videos:true,
//                 favourites:true
//             }
//         })
//         res.status(200).json({message:'Product fetched',product})
//     } catch (error) {
//         res.status(500).json({ error: `Internal Server Error: ${error.message}` });
//     }
// };

export const fetchProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.products.findMany({
            include: {
                images: true,
                // Specifications: true,
                // productHighlights: true,
                // videos: true,
                favourites: true,
                cart: true
            }
        })
        res.status(200).json({ message: 'Products fetched', products })
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const fetchSpecificProducts = async (req: Request, res: Response) => {
    try {

        const { typeOfMetal, start, end } = req.query;
        if (!typeOfMetal) {
            return res.status(400).json({ message: "enter metal type" })
        }
        if (!start) {
            return res.status(400).json({ message: "enter starting" })
        }
        if (!end) {
            return res.status(400).json({ message: "enter ending" })
        }
        const startIndex = Number(start);
        const endIndex = Number(end);
        const totalProducts = await prisma.products.count({
            where: {
                metalType: typeOfMetal as MetalType,
            },
        });
        const totalPages = Math.ceil(totalProducts / 24)
        const products = await prisma.products.findMany({
            skip: startIndex,
            take: endIndex - startIndex,
            where: {
                metalType: typeOfMetal as MetalType
            }
            ,
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true
            }
        })
        res.status(200).json({ message: 'Product fetched', products, totalPages })
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
export const removeProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Id not provided" });
        }

        const userId = Number(res.locals.user.id);
        const productAuthorized = await prisma.products.findFirst({
            where: {
                id: Number(id),
                sellerId: userId
            }
        })
        if (productAuthorized) {
            await prisma.images.deleteMany({
                where: {
                    productId: Number(id),

                }
            })
            await prisma.videos.deleteMany({
                where: {
                    productId: Number(id)
                }
            })
            await prisma.specifications.deleteMany({
                where: {
                    productId: Number(id)
                }
            })
            await prisma.highlights.deleteMany({
                where: {
                    productId: Number(id)
                }
            })
            await prisma.cart.deleteMany({
                where: {
                    productId: Number(id)

                }
            })
            await prisma.favourites.deleteMany({
                where: {
                    productId: Number(id)

                }
            })
            let deletedProduct = await prisma.products.delete({
                where: {
                    id: Number(id),
                    sellerId: userId
                },


            }).catch(error => { console.log(error) })
            return res.status(201).json({ message: "Product deleted succesfully ", deletedProduct })
        }
        return res.status(401).json({ message: "You are not authorized" })



    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};


export const fetchSearchedProduct = async (req: Request, res: Response) => {
    try {

        const { searchQuery } = req.query;
        console.log(searchQuery)
        if (typeof searchQuery !== 'string' || searchQuery.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const products = await prisma.products.findMany({
            where: {
                OR: [
                    {
                        metalType: {
                            in: Object.values(MetalType).filter((type) =>
                                type.toLowerCase().includes(searchQuery.toLowerCase())
                            ),
                        },
                    },
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { description: { contains: searchQuery, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true
            }
        });
        console.log(products)
        if (products.length > 0) {
            return res.status(200).json({ message: 'Products fetched', products })

        }
        return res.status(404).json({ message: 'No Product Exist' })

    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
