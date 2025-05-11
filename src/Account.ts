import HttpsClient from './HttpsClient.js';
import { AccountInfoResponse } from './types.js';

/**
 * Account API endpoints
 */
class Account extends HttpsClient {
  /**
   * Returns account info
   * @returns Promise with account information
   */
  async info(): Promise<AccountInfoResponse> {
    return this.request<AccountInfoResponse>({
      method: 'GET',
      path: 'account/info'
    });
  }
}

export default Account;
