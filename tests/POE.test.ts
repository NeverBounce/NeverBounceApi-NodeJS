import POE from '../src/POE.js';
import { RequestOptions } from '../src/types.js';
import { jest } from '@jest/globals';

// We don't need to mock HttpsClient directly
// Instead, we'll mock the request method on the POE instance

describe('POE', () => {
  let poe: any;
  let mockClient: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

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
    
    // Create a new POE instance for each test
    poe = new POE(mockClient);
    
    // Mock the request method directly on the POE instance
    poe.request = jest.fn();
  });

  describe('confirm', () => {
    it('should call request with correct parameters', async () => {
      // Arrange
      const email = 'test@example.com';
      const result = 0;
      const confirmationToken = 'abc123';
      const transactionId = 'txn456';
      
      const mockResponse = {
        status: 'success',
        token_confirmed: true,
        token_age: '2023-12-01 12:34:56'
      };
      
      poe.request.mockResolvedValueOnce(mockResponse);

      // Act
      const response = await poe.confirm(email, result, confirmationToken, transactionId);

      // Assert
      expect(poe.request).toHaveBeenCalledTimes(1);
      expect(poe.request).toHaveBeenCalledWith(
        {
          method: 'POST',
          path: 'poe/confirm'
        },
        {
          email: email,
          result: result,
          confirmation_token: confirmationToken,
          transaction_id: transactionId
        }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle different result values', async () => {
      // Arrange
      const email = 'test@example.com';
      const result = 1; // Different result value
      const confirmationToken = 'abc123';
      const transactionId = 'txn456';
      
      const mockResponse = {
        status: 'success',
        token_confirmed: true,
        token_age: '2023-12-01 12:34:56'
      };
      
      poe.request.mockResolvedValueOnce(mockResponse);

      // Act
      const response = await poe.confirm(email, result, confirmationToken, transactionId);

      // Assert
      expect(poe.request).toHaveBeenCalledWith(
        {
          method: 'POST',
          path: 'poe/confirm'
        },
        {
          email: email,
          result: result,
          confirmation_token: confirmationToken,
          transaction_id: transactionId
        }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should propagate errors from request method', async () => {
      // Arrange
      const email = 'test@example.com';
      const result = 0;
      const confirmationToken = 'abc123';
      const transactionId = 'txn456';
      
      const mockError = new Error('API Error');
      poe.request.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(poe.confirm(email, result, confirmationToken, transactionId))
        .rejects.toThrow('API Error');
      
      expect(poe.request).toHaveBeenCalledTimes(1);
    });

    it('should handle successful confirmation with false token_confirmed', async () => {
      // Arrange
      const email = 'test@example.com';
      const result = 0;
      const confirmationToken = 'abc123';
      const transactionId = 'txn456';
      
      const mockResponse = {
        status: 'success',
        token_confirmed: false,
        message: 'Token has expired'
      };
      
      poe.request.mockResolvedValueOnce(mockResponse);

      // Act
      const response = await poe.confirm(email, result, confirmationToken, transactionId);

      // Assert
      expect(poe.request).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockResponse);
    });

    it('should handle confirmation with non-standard response fields', async () => {
      // Arrange
      const email = 'test@example.com';
      const result = 2;
      const confirmationToken = 'abc123';
      const transactionId = 'txn456';
      
      const mockResponse = {
        status: 'success',
        token_confirmed: true,
        token_age: '2023-12-01 12:34:56',
        additional_field: 'extra data'
      };
      
      poe.request.mockResolvedValueOnce(mockResponse);

      // Act
      const response = await poe.confirm(email, result, confirmationToken, transactionId);

      // Assert
      expect(poe.request).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockResponse);
      expect(response.additional_field).toBe('extra data');
    });

    it('should handle special characters in email address', async () => {
      // Arrange
      const email = 'test+special@example.com'; // Email with + character
      const result = 0;
      const confirmationToken = 'abc123';
      const transactionId = 'txn456';
      
      const mockResponse = {
        status: 'success',
        token_confirmed: true,
        token_age: '2023-12-01 12:34:56'
      };
      
      poe.request.mockResolvedValueOnce(mockResponse);

      // Act
      const response = await poe.confirm(email, result, confirmationToken, transactionId);

      // Assert
      expect(poe.request).toHaveBeenCalledWith(
        {
          method: 'POST',
          path: 'poe/confirm'
        },
        {
          email: email,
          result: result,
          confirmation_token: confirmationToken,
          transaction_id: transactionId
        }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle long tokens and transaction IDs', async () => {
      // Arrange
      const email = 'test@example.com';
      const result = 0;
      const confirmationToken = 'a'.repeat(100); // Very long token
      const transactionId = 'b'.repeat(100); // Very long transaction ID
      
      const mockResponse = {
        status: 'success',
        token_confirmed: true,
        token_age: '2023-12-01 12:34:56'
      };
      
      poe.request.mockResolvedValueOnce(mockResponse);

      // Act
      const response = await poe.confirm(email, result, confirmationToken, transactionId);

      // Assert
      expect(poe.request).toHaveBeenCalledWith(
        {
          method: 'POST',
          path: 'poe/confirm'
        },
        {
          email: email,
          result: result,
          confirmation_token: confirmationToken,
          transaction_id: transactionId
        }
      );
      expect(response).toEqual(mockResponse);
    });
  });
});
