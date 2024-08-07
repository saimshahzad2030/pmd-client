 
import admin from 'firebase-admin' 
import { sdk } from '../firebase-sdk'; 
import config from '../config';
admin.initializeApp({
    credential: admin.credential.cert(sdk as object),
    storageBucket: config.BUCKET_URL
  });

export const bucket = admin.storage().bucket();
 