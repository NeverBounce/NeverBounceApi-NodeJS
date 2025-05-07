import HttpsClient from './HttpsClient.js';
import VerificationObject from './VerificationObject.js';
import { SingleVerificationRequest, SingleVerificationResponse } from './types.js';

/**
 * Single email verification API endpoints
 */
class Single extends HttpsClient {
  /**
   * Performs the verification of a single email
   * @param email Email address to verify
   * @param address_info Whether to include address info in the response
   * @param credits_info Whether to include credits info in the response
   * @param timeout Timeout for the verification in milliseconds
   * @param historicalData Whether to leverage historical data
   * @returns Promise with verification object
   */
  async check(
    email: string,
    address_info?: boolean,
    credits_info?: boolean,
    timeout?: number,
    historicalData?: boolean
  ): Promise<VerificationObject> {
    const data: SingleVerificationRequest & { request_meta_data?: { leverage_historical_data: number } } = {
      email,
      address_info: address_info || undefined,
      credits_info: credits_info || undefined,
      timeout: timeout || undefined
    };

    if (historicalData !== undefined) {
      data.request_meta_data = { leverage_historical_data: historicalData ? 1 : 0 };
    }

    const response = await this.request<SingleVerificationResponse>({
      method: 'GET',
      path: 'single/check'
    }, data);
    
    return new VerificationObject(response);
  }
}

export default Single;
