import Account from '../src/Account';
import { RequestOptions } from '../src/types.js';
import { jest } from '@jest/globals';

// We don't need to mock HttpsClient directly
// Instead, we'll mock the request method on the Account instance

describe('Account', () => {
  let account: any;
  let mockClient: any;

  beforeEach(() => {
    // Clear all mock implementations and calls before each test
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
    
    // Create a new Account instance for each test
    account = new Account(mockClient);
    
    // Mock the request method directly on the Account instance
    account.request = jest.fn();
  });

  describe('info()', () => {
    it('should call request with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        id: '12345',
        name: 'Test Account',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z'
      };
      
      account.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await account.info();

      // Assert
      expect(account.request).toHaveBeenCalledTimes(1);
      expect(account.request).toHaveBeenCalledWith({
        method: 'GET',
        path: 'account/info'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from the request method', async () => {
      // Arrange
      const mockError = new Error('Network error');
      account.request.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(account.info()).rejects.toThrow('Network error');
      expect(account.request).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response correctly', async () => {
      // Arrange
      const mockEmptyResponse = {};
      account.request.mockResolvedValueOnce(mockEmptyResponse);

      // Act
      const result = await account.info();

      // Assert
      expect(result).toEqual({});
      expect(account.request).toHaveBeenCalledTimes(1);
    });

    it('should return the exact response from request method', async () => {
      // Arrange
      const mockDetailedResponse = {
        id: 'acc_123456789',
        name: 'Premium Account',
        status: 'active',
        features: ['feature1', 'feature2'],
        limits: {
          maxUsers: 10,
          maxStorage: '5GB'
        },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-06-15T12:34:56Z'
      };
      
      account.request.mockResolvedValueOnce(mockDetailedResponse);

      // Act
      const result = await account.info();

      // Assert
      expect(result).toEqual(mockDetailedResponse);
      expect(account.request).toHaveBeenCalledWith({
        method: 'GET',
        path: 'account/info'
      });
    });
  });
});
