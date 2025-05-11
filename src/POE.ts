import HttpsClient from './HttpsClient.js';
import { POEConfirmationRequest, POEConfirmationResponse } from './types.js';

/**
 * POE (Proof of Email) API endpoints
 */
class POE extends HttpsClient {
  /**
   * Confirms a POE token
   * @param email Email address
   * @param result Verification result
   * @param confirmationToken Confirmation token
   * @param transactionId Transaction ID
   * @returns Promise with confirmation response
   */
  async confirm(
    email: string,
    result: number,
    confirmationToken: string,
    transactionId: string
  ): Promise<POEConfirmationResponse> {
    const data: POEConfirmationRequest = {
      email,
      result,
      confirmation_token: confirmationToken,
      transaction_id: transactionId
    };

    return this.request<POEConfirmationResponse>({
      method: 'POST',
      path: 'poe/confirm'
    }, data);
  }
}

export default POE;
