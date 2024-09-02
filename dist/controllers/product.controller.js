"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSearchedProduct = exports.removeProduct = exports.fetchSpecificProducts = exports.fetchProducts = exports.fetchSingleProductByType = exports.fetchSingleProduct = exports.addProduct = void 0;
const db_1 = __importDefault(require("../db/db"));
const req_1 = require("../types/req");
const upload_file_1 = require("../services/upload-file");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { description, specifications, name, available, price, productDetails, productHighlights, metalType } = req.body;
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
        const files = req.files;
        const images = Array.isArray(files) ? [] : (files['images'] || []);
        const videos = Array.isArray(files) ? [] : (files['videos'] || []);
        const imageUrls = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, upload_file_1.uploadFile)(image, `images`);
        })));
        const videoUrls = yield Promise.all(videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, upload_file_1.uploadFile)(video, `videos`);
        })));
        console.log(productHighlights);
        const sellerId = Number((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user.id);
        const newProduct = yield db_1.default.products.create({
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
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.addProduct = addProduct;
const fetchSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const product = yield db_1.default.products.findFirst({
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
        });
        const relatedProducts = yield db_1.default.products.findMany({
            where: {
                id: {
                    not: product.id,
                },
                metalType: product.metalType
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true,
            }
        });
        const productReview = yield db_1.default.productReviews.findMany({
            where: {
                productId: Number(id)
            },
            include: {
                user: true,
            }
        });
        res.status(200).json({ message: 'Product fetched', product, relatedProducts, productReview });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchSingleProduct = fetchSingleProduct;
const fetchSingleProductByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const relatedProducts = yield db_1.default.products.findMany({
            where: {
                metalType: type
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true
            }
        });
        res.status(200).json({ message: 'Product fetched', relatedProducts });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchSingleProductByType = fetchSingleProductByType;
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
const fetchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('sdad');
        const products = yield db_1.default.products.findMany({
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true,
                cart: true
            }
        });
        res.status(200).json({ message: 'Products fetched', products });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchProducts = fetchProducts;
const fetchSpecificProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeOfMetal, start, end } = req.query;
        if (!typeOfMetal) {
            return res.status(400).json({ message: "enter metal type" });
        }
        if (!start) {
            return res.status(400).json({ message: "enter starting" });
        }
        if (!end) {
            return res.status(400).json({ message: "enter ending" });
        }
        const startIndex = Number(start);
        const endIndex = Number(end);
        const products = yield db_1.default.products.findMany({
            skip: startIndex,
            take: endIndex - startIndex,
            where: {
                metalType: typeOfMetal
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true,
                favourites: true
            }
        });
        res.status(200).json({ message: 'Produst fetched', products });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchSpecificProducts = fetchSpecificProducts;
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Id not provided" });
        }
        const userId = Number(res.locals.user.id);
        const productAuthorized = yield db_1.default.products.findFirst({
            where: {
                id: Number(id),
                sellerId: userId
            }
        });
        if (productAuthorized) {
            yield db_1.default.images.deleteMany({
                where: {
                    productId: Number(id),
                }
            });
            yield db_1.default.videos.deleteMany({
                where: {
                    productId: Number(id)
                }
            });
            yield db_1.default.specifications.deleteMany({
                where: {
                    productId: Number(id)
                }
            });
            yield db_1.default.highlights.deleteMany({
                where: {
                    productId: Number(id)
                }
            });
            yield db_1.default.cart.deleteMany({
                where: {
                    productId: Number(id)
                }
            });
            yield db_1.default.favourites.deleteMany({
                where: {
                    productId: Number(id)
                }
            });
            let deletedProduct = yield db_1.default.products.delete({
                where: {
                    id: Number(id),
                    sellerId: userId
                },
            }).catch(error => { console.log(error); });
            return res.status(201).json({ message: "Product deleted succesfully ", deletedProduct });
        }
        return res.status(401).json({ message: "You are not authorized" });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.removeProduct = removeProduct;
const fetchSearchedProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchQuery } = req.query;
        console.log(searchQuery);
        if (typeof searchQuery !== 'string' || searchQuery.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const products = yield db_1.default.products.findMany({
            where: {
                OR: [
                    {
                        metalType: {
                            in: Object.values(req_1.MetalType).filter((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
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
        console.log(products);
        if (products.length > 0) {
            return res.status(200).json({ message: 'Products fetched', products });
        }
        return res.status(404).json({ message: 'No Product Exist' });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchSearchedProduct = fetchSearchedProduct;
//# sourceMappingURL=product.controller.js.map