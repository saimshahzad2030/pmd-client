// utils/uploadToFirebase.js
import config from "../config";
import { bucket } from "../firebase/firebase";

export const uploadFile = async (image:any, destination:string) => {
  try {
    const dateTime = Date.now();
    const filePath = `${destination}/_${dateTime}`;
    const fileUpload = bucket.file(filePath);
 

    // Upload the buffer to Firebase Storage
    await fileUpload.save(image.buffer, {
      metadata: {
        contentType: image.mimetype,
      },
    });

    // Make the file publicly accessible
    await fileUpload.makePublic();

    // Construct the public URL
    const url = `https://firebasestorage.googleapis.com/v0/b/${process.env.BUCKET_URL}/o/${destination}%2F_${dateTime}?alt=media`;
    console.log(`File uploaded successfully to ${url}`);

    return url;
    } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

 
