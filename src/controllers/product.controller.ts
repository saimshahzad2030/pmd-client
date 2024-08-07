import { Request, Response } from "express";
import prisma from "../db/db";
import { MetalType, productReqType, productReviewType, websiteReviewType } from "req";
import { uploadFile } from "../services/upload-file"; 
import { messaging } from "firebase-admin";
// import { File } from "buffer";
 
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
        const { description, specifications, name, available, price, productDetails, productHighlights , metalType } = req.body as productReqType;
        // if (!description ) {

        if (!description || !specifications || !name || !available || !price || !productDetails || !productHighlights || !metalType  ) {
            return res.status(400).json({ message: "All fields are required" });
        } 
        if (!req.files) {
            res.status(400).send('No file uploaded.');
            return;
          }
  
        console.log(req.body)
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } |  Express.Multer.File[];
        const images: Express.Multer.File[]   = Array.isArray(files) ? [] : (files['images'] || []);
        const videos: Express.Multer.File[]  = Array.isArray(files) ? [] : (files['videos'] || []);
        const imageUrls: string[] = await Promise.all(
            images.map(async (image: File) => {
                console.log(image)
                return await uploadFile(image, `images`);

            })
        );
         const videoUrls: string[]  = await Promise.all(
            videos.map(async (video: File) => {
                return await uploadFile(video.buffer, `videos`);
            })
        );
        // console.log(typeof specifications)
        // let abc:any  = specifications 
        // const parsedSpecifications = abc.slice(1, -1).split(',');  
        // let abcd:any  = specifications 
        // const parsedHighlights = abcd.slice(1, -1).split(',');  
        //  console.log(parsedSpecifications)
        const sellerId = Number(res.locals?.user.id); 
        console.log(res.locals)
        const newProduct = await prisma.products.create({
            data: {
                name,
                sellerId,
                metalType,
                available: Number(available),
                rating:4,
                price:Number(price),
                productDetails,
                description,
                images: {
                    create:imageUrls.map(url => ({
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
                    create: productHighlights.map((highlight) => ({
                        highlight: highlight
                    }))
                }
                
            }
        }); 
        res.status(201).json({ message: "Product added successfully",newProduct});
        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });

        // res.status(201).json({ message: "Product added successfully", imageUrls,videoUrls,specifications,productHighlights });
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const fetchProducts = async (req: Request, res: Response) => {
    try {


         const products = await prisma.products.findMany({
            include:{
                images:true,
                Specifications:true,
                productHighlights:true,
                videos:true
            }
        })
        res.status(200).json({message:'Produst fetched',products})
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const fetchSpecificProducts = async (req: Request, res: Response) => {
    try {

        const {typeOfMetal} = req.query;
        if(!typeOfMetal){
            return res.status(400).json({message:"enter metal type"})
        }
         const products = await prisma.products.findMany({
            where:{
                metalType:typeOfMetal as MetalType
            }
            ,
            include:{
                images:true,
                Specifications:true,
                productHighlights:true,
                videos:true
            }
        })
        res.status(200).json({message:'Produst fetched',products})
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
export const removeProduct = async (req: Request, res: Response) => {
    try {
         const {id} = req.query;
        if (!id ) {
            return res.status(400).json({ message: "Id not provided" });
        } 
         
        const userId =Number(res.locals.user.id);
        await prisma.images.deleteMany({
            where:{
                productId:Number(id)
            }
        })
        await prisma.videos.deleteMany({
            where:{
                productId:Number(id)
            }
        })
        await prisma.specifications.deleteMany({
            where:{
                productId:Number(id)
            }
        })
        await prisma.highlights.deleteMany({
            where:{
                productId:Number(id)
            }
        })
        let deletedProduct = await prisma.products.delete({
            where:{
                id:Number(id),
                sellerId:userId
            },
            
           
        }).catch(error=>{console.log(error)})

        return res.status(201).json({ message: "Product deleted succesfully ", deletedProduct })
  
        
        
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};


