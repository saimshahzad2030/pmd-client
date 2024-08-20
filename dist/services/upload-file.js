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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const firebase_1 = require("../firebase/firebase");
const uploadFile = (image, destination) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dateTime = Date.now();
        const filePath = `${destination}/_${dateTime}`;
        const fileUpload = firebase_1.bucket.file(filePath);
        // Upload the buffer to Firebase Storage
        yield fileUpload.save(image.buffer, {
            metadata: {
                contentType: image.mimetype,
            },
        });
        // Make the file publicly accessible
        yield fileUpload.makePublic();
        // Construct the public URL
        const url = `https://firebasestorage.googleapis.com/v0/b/${process.env.BUCKET_URL}/o/${destination}%2F_${dateTime}?alt=media`;
        console.log(`File uploaded successfully to ${url}`);
        return url;
    }
    catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
});
exports.uploadFile = uploadFile;
//# sourceMappingURL=upload-file.js.map