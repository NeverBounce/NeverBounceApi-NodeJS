import Single from '../src/Single';
import { RequestOptions } from '../src/types';
import { jest } from '@jest/globals';

// We don't need to mock HttpsClient directly
// Instead, we'll mock the request method on the Single instance

describe('Single', () => {
  let single: any;
  let mockResponse: any;
  let mockClient: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock NeverBounce client
    mockClient = {
      getConfig: jest.fn().mockReturnValue({
        apiKey: 'test-api-key',
        apiVersion: 'v4.2',
        timeout: 30000,
        opts: {
          acceptedType: 'application/json',
          host: 'api.neverbounce.com',
          port: 443,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NeverBounce-Node/5.0.0'
          }
        }
      }),
      getRequestOpts: jest.fn().mockImplementation((params: any) => {
        return {
          acceptedType: 'application/json',
          host: 'api.neverbounce.com',
          port: 443,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NeverBounce-Node/5.0.0',
            ...((params && params.headers) || {})
          },
          ...(params || {})
        } as RequestOptions;
      })
    };
    
    // Create an instance of Single
    single = new Single(mockClient);
    
    // Setup a mock response
    mockResponse = {
      email: 'test@example.com',
      status: 'valid',
      result: 'valid',
      // Add other properties as needed for your tests
    };
    
    // Mock the request method directly on the Single instance
    single.request = jest.fn();
    single.request.mockResolvedValue(mockResponse);
  });

  describe('check method', () => {
    
    test('should include address_info when provided', async () => {
      const email = 'test@example.com';
      const address_info = true;
      
      await single.check(email, address_info);
      
      expect(single.request).toHaveBeenCalledWith(
        {
          method: 'GET',
          path: 'single/check'
        },
        {
          email: 'test@example.com',
          address_info: true,
          credits_info: undefined,
          timeout: undefined
        }
      );
    });
    
    test('should include credits_info when provided', async () => {
      const email = 'test@example.com';
      const address_info = false;
      const credits_info = true;
      
      await single.check(email, address_info, credits_info);
      
      expect(single.request).toHaveBeenCalledWith(
        {
          method: 'GET',
          path: 'single/check'
        },
        {
          email: 'test@example.com',
          address_info: undefined,
          credits_info: true,
          timeout: undefined
        }
      );
    });
    
    test('should include timeout when provided', async () => {
      const email = 'test@example.com';
      const address_info = false;
      const credits_info = false;
      const timeout = 5000;
      
      await single.check(email, address_info, credits_info, timeout);
      
      expect(single.request).toHaveBeenCalledWith(
        {
          method: 'GET',
          path: 'single/check'
        },
        {
          email: 'test@example.com',
          address_info: undefined,
          credits_info: undefined,
          timeout: 5000
        }
      );
    });
    
    test('should include historicalData when provided as true', async () => {
      const email = 'test@example.com';
      const address_info = false;
      const credits_info = false;
      const timeout = null;
      const historicalData = true;
      
      await single.check(email, address_info, credits_info, timeout, historicalData);
      
      expect(single.request).toHaveBeenCalledWith(
        {
          method: 'GET',
          path: 'single/check'
        },
        {
          email: 'test@example.com',
          address_info: undefined,
          credits_info: undefined,
          timeout: undefined,
          request_meta_data: {
            leverage_historical_data: 1
          }
        }
      );
    });
    
    test('should include historicalData when provided as false', async () => {
      const email = 'test@example.com';
      const address_info = false;
      const credits_info = false;
      const timeout = null;
      const historicalData = false;
      
      await single.check(email, address_info, credits_info, timeout, historicalData);
      
      expect(single.request).toHaveBeenCalledWith(
        {
          method: 'GET',
          path: 'single/check'
        },
        {
          email: 'test@example.com',
          address_info: undefined,
          credits_info: undefined,
          timeout: undefined,
          request_meta_data: {
            leverage_historical_data: 0
          }
        }
      );
    });
    
    test('should include all parameters when provided', async () => {
      const email = 'test@example.com';
      const address_info = true;
      const credits_info = true;
      const timeout = 10000;
      const historicalData = true;
      
      await single.check(email, address_info, credits_info, timeout, historicalData);
      
      expect(single.request).toHaveBeenCalledWith(
        {
          method: 'GET',
          path: 'single/check'
        },
        {
          email: 'test@example.com',
          address_info: true,
          credits_info: true,
          timeout: 10000,
          request_meta_data: {
            leverage_historical_data: 1
          }
        }
      );
    });
    
    
  });
});
