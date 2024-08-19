import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
 
const config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY  ,
  TYPE:process.env.TYPE,
BUCKET_URL:process.env.BUCKET_URL,
PROJECT_ID:process.env.PROJECT_ID,
PRIVATE_KEY_ID:process.env.PRIVATE_KEY_ID,
PRIVATE_KEY:process.env.PRIVATE_KEY,
CLIENT_EMAIL:process.env.CLIENT_EMAIL,
CLIENT_ID:process.env.CLIENT_ID,
AUTH_URI:process.env.AUTH_URI,
TOKEN_URI:process.env.TOKEN_URI,
AUTH_PROVIDER_X509_CERT_URL:process.env.AUTH_PROVIDER_X509_CERT_URL,
CLIENT_X509_CCERT_URL:process.env.CLIENT_X509_CCERT_URL,
UNIVERSE_DOMAIN:process.env.UNIVERSE_DOMAIN,
PLAID_CLIENT_ID:process.env.PLAID_CLIENT_ID,
PLAID_SECRET:process.env.PLAID_SECRET,
PLAID_ENV:process.env.PLAID_ENV,
STRIPE_SECRET:process.env.STRIPE_SECRET,
STRIPE_ACCOUNT_ID:process.env.STRIPE_ACCOUNT_ID,
CLIENT_URL:process.env.CLIENT_URL
};
 export default config