import _Error from './Errors.js';
import { ApiResponse, RequestOptions } from './types.js';

/**
 * Interface for NeverBounce client
 */
interface NeverBounceClient {
  getConfig(): {
    apiKey: string | null;
    apiVersion: string;
    timeout: number;
    opts: RequestOptions;
  };
  getRequestOpts(params: Partial<RequestOptions>): RequestOptions;
}

/**
 * HTTP Client for making API requests using fetch
 */
class HttpsClient {
  private _nb: NeverBounceClient;
  private _version: string;

  /**
   * Constructor
   * @param _nb NeverBounce client instance
   */
  constructor(_nb: NeverBounceClient) {
    this._nb = _nb;
    // Get version from package.json
    this._version = '5.0.0'; // This will be replaced with dynamic import when we implement the build process
  }

  /**
   * Performs API requests using fetch
   * @param params Request parameters
   * @param data Request data
   * @returns Promise with API response
   */
  async request<T extends ApiResponse>(params: Partial<RequestOptions>, data: Record<string, any> = {}): Promise<T> {
    const config = this._nb.getConfig();
    // Set key
    data.key = config.apiKey;

    // Get request options
    const opts = this._nb.getRequestOpts(params);
    const path = opts.path ? `/${config.apiVersion}/${opts.path}` : '';
    
    // Build URL
    const url = new URL(`https://${opts.host}:${opts.port}${path}`);
    
    // Set up fetch options
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': opts.acceptedType,
        'User-Agent': `NeverBounceApi-NodeJS/${this._version}`
      },
      body: JSON.stringify(data)
    };

    // Set up AbortController for timeout
    const controller = new AbortController();
    if (config.timeout) {
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      fetchOptions.signal = controller.signal;
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      
      // Handle HTTP error codes
      if (response.status >= 400 && response.status < 500) {
        throw new _Error(
          _Error.GeneralError,
          `We were unable to complete your request. The following information was supplied: \n\n(Request error [status ${response.status}])`
        );
      }
      
      if (response.status >= 500) {
        throw new _Error(
          _Error.GeneralError,
          `We were unable to complete your request. The following information was supplied: \n\n(Internal error [status ${response.status}])`
        );
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const decoded = await response.json() as T;
        
        // Check for missing status and error messages
        if (decoded.status === undefined || (decoded.status !== 'success' && decoded.message === undefined)) {
          throw new _Error(
            _Error.GeneralError,
            'The response from server is incomplete. Either a status code was not included or ' +
            'an error was returned without an error message. Try the request again, if ' +
            'this error persists let us know at support@neverbounce.com.' +
            `\n\n(Internal error [status ${response.status}])`
          );
        }

        // Handle error statuses
        if (decoded.status !== 'success') {
          const errorType = _Error._lut[decoded.status] || _Error.GeneralError;
          
          if (errorType === _Error.AuthError) {
            throw new _Error(
              _Error.AuthError,
              `We were unable to authenticate your request. The following information was supplied: ${decoded.message}\n\n(auth_failure)`
            );
          } else {
            throw new _Error(
              errorType,
              `We were unable to complete your request. The following information was supplied: ${decoded.message}\n\n(${decoded.status})`
            );
          }
        }

        return decoded;
      } else if (contentType && contentType !== opts.acceptedType) {
        throw new _Error(
          _Error.GeneralError,
          `The response from NeverBounce was returned with the type "${contentType}" but a response ` +
          `type of "${opts.acceptedType}" was expected. Try the request again, if this error persists ` +
          'let us know at support@neverbounce.com.\n\n(Internal error)'
        );
      }

      // Return text response for non-JSON content types
      const textResponse = await response.text();
      return textResponse as unknown as T;
      
    } catch (error) {
      // Handle fetch errors or our custom errors
      if (error instanceof _Error) {
        throw error;
      }
      
      // Handle timeout or network errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new _Error(_Error.GeneralError, 'The request timed out. Please try again later.');
        }
        throw new _Error(_Error.GeneralError, `Network error: ${error.message}`);
      }
      
      // Fallback for unknown errors
      throw new _Error(_Error.GeneralError, 'An unknown error occurred during the request.');
    }
  }
}

export default HttpsClient;
