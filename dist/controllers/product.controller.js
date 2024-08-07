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
exports.removeProduct = exports.fetchSpecificProducts = exports.fetchProducts = exports.addProduct = void 0;
const db_1 = __importDefault(require("../db/db"));
const upload_file_1 = require("../services/upload-file");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { description, specifications, name, available, price, productDetails, productHighlights, metalType } = req.body;
        // if (!description ) {
        if (!description || !specifications || !name || !available || !price || !productDetails || !productHighlights || !metalType) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!req.files) {
            res.status(400).send('No file uploaded.');
            return;
        }
        console.log(req.body);
        const files = req.files;
        const images = Array.isArray(files) ? [] : (files['images'] || []);
        const videos = Array.isArray(files) ? [] : (files['videos'] || []);
        const imageUrls = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(image);
            return yield (0, upload_file_1.uploadFile)(image, `images`);
        })));
        const videoUrls = yield Promise.all(videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, upload_file_1.uploadFile)(video.buffer, `videos`);
        })));
        // console.log(typeof specifications)
        // let abc:any  = specifications 
        // const parsedSpecifications = abc.slice(1, -1).split(',');  
        // let abcd:any  = specifications 
        // const parsedHighlights = abcd.slice(1, -1).split(',');  
        //  console.log(parsedSpecifications)
        const sellerId = Number((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user.id);
        console.log(res.locals);
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
                    create: productHighlights.map((highlight) => ({
                        highlight: highlight
                    }))
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
const fetchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.default.products.findMany({
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true
            }
        });
        res.status(200).json({ message: 'Produst fetched', products });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.fetchProducts = fetchProducts;
const fetchSpecificProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeOfMetal } = req.query;
        if (!typeOfMetal) {
            return res.status(400).json({ message: "enter metal type" });
        }
        const products = yield db_1.default.products.findMany({
            where: {
                metalType: typeOfMetal
            },
            include: {
                images: true,
                Specifications: true,
                productHighlights: true,
                videos: true
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
        yield db_1.default.images.deleteMany({
            where: {
                productId: Number(id)
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
        let deletedProduct = yield db_1.default.products.delete({
            where: {
                id: Number(id),
                sellerId: userId
            },
        }).catch(error => { console.log(error); });
        return res.status(201).json({ message: "Product deleted succesfully ", deletedProduct });
    }
    catch (error) {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});
exports.removeProduct = removeProduct;
//# sourceMappingURL=product.controller.js.map