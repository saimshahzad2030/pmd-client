import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import config from '../config';

export const client = new PlaidApi(
  new Configuration({
    // basePath: PlaidEnvironments.development,
    // 
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.PLAID_CLIENT_ID,
        'PLAID-SECRET': config.PLAID_SECRET,
      },
    },
  })
);

