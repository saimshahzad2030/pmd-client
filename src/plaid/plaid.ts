import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import config from '../config';

export const client = new PlaidApi(
  new Configuration({


    basePath: config.PLAID_ENV == 'sandbox' ? PlaidEnvironments.sandbox : PlaidEnvironments.development,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.PLAID_CLIENT_ID,
        'PLAID-SECRET': config.PLAID_SECRET,
      },
    },
  })
);

