import Jobs from '../src/Jobs.js';
import { RequestOptions } from '../src/types.js';
import { jest } from '@jest/globals';

// We don't need to mock HttpsClient directly
// Instead, we'll mock the request method on the Jobs instance

describe('Jobs', () => {
  let jobs: any;
  let mockClient: any;

  beforeEach(() => {
    // Clear all mocks
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
    
    // Create new Jobs instance
    jobs = new Jobs(mockClient);
    
    // Mock the request method directly on the Jobs instance
    jobs.request = jest.fn();
  });

  describe('search', () => {
    it('should call request with correct parameters when no query is provided', async () => {
      // Arrange
      const mockResponse = { status: 'success', results: [] };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.search();

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'GET', path: 'jobs/search' },
        {}
      );
      expect(result).toBe(mockResponse);
    });

    it('should call request with correct parameters when query is provided', async () => {
      // Arrange
      const mockQuery = { page: 1, per_page: 10 };
      const mockResponse = { status: 'success', results: [] };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.search(mockQuery);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'GET', path: 'jobs/search' },
        mockQuery
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('create', () => {
    it('should handle array input correctly', async () => {
      // Arrange
      const mockInput = ['test@example.com', 'test2@example.com'];
      const mockResponse = { status: 'success', job_id: 123 };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.create(mockInput);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/create' },
        {
          input: mockInput,
          input_location: undefined,
          filename: undefined,
          run_sample: null,
          auto_start: null,
          auto_parse: null,
          allow_manual_review: null,
          callback_url: null,
          callback_headers: null
        }
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle string input correctly', async () => {
      // Arrange
      const mockInput = 'https://example.com/emails.csv';
      const mockResponse = { status: 'success', job_id: 123 };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.create(mockInput, Jobs.remote);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/create' },
        {
          input: [mockInput],
          input_location: Jobs.remote,
          filename: undefined,
          run_sample: null,
          auto_start: null,
          auto_parse: null,
          allow_manual_review: null,
          callback_url: null,
          callback_headers: null
        }
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle all optional parameters correctly', async () => {
      // Arrange
      const mockInput = ['test@example.com'];
      const mockFilename = 'test-job.csv';
      const mockCallbackHeaders = { 'X-Custom-Header': 'value' };
      const mockCallbackUrl = 'https://example.com/callback';
      const mockResponse = { status: 'success', job_id: 123 };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.create(
        mockInput,
        Jobs.supplied,
        mockFilename,
        true, // runsample
        true, // autoparse
        true, // autostart
        true, // historicalData
        true, // allowManualReview
        mockCallbackUrl,
        mockCallbackHeaders
      );

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/create' },
        {
          input: mockInput,
          input_location: Jobs.supplied,
          filename: mockFilename,
          run_sample: true,
          auto_start: true,
          auto_parse: true,
          request_meta_data: { leverage_historical_data: 1 },
          allow_manual_review: true,
          callback_url: mockCallbackUrl,
          callback_headers: mockCallbackHeaders
        }
      );
      expect(result).toBe(mockResponse);
    });

    it('should set historical data to 0 when false', async () => {
      // Arrange
      const mockInput = ['test@example.com'];
      const mockResponse = { status: 'success', job_id: 123 };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.create(
        mockInput,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false // historicalData
      );

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/create' },
        expect.objectContaining({
          request_meta_data: { leverage_historical_data: 0 }
        })
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('parse', () => {
    it('should call request with correct parameters', async () => {
      // Arrange
      const jobId = 123;
      const mockResponse = { status: 'success' };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.parse(jobId);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/parse' },
        { job_id: jobId, auto_start: undefined }
      );
      expect(result).toBe(mockResponse);
    });

    it('should include autostart when provided', async () => {
      // Arrange
      const jobId = 123;
      const autostart = true;
      const mockResponse = { status: 'success' };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.parse(jobId, autostart);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/parse' },
        { job_id: jobId, auto_start: autostart }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('start', () => {
    it('should call request with correct parameters', async () => {
      // Arrange
      const jobId = 123;
      const mockResponse = { status: 'success' };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.start(jobId);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/start' },
        { job_id: jobId, run_sample: undefined, allow_manual_review: undefined }
      );
      expect(result).toBe(mockResponse);
    });

    it('should include optional parameters when provided', async () => {
      // Arrange
      const jobId = 123;
      const runSample = true;
      const allowManualReview = true;
      const mockResponse = { status: 'success' };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.start(jobId, runSample, allowManualReview);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/start' },
        { job_id: jobId, run_sample: runSample, allow_manual_review: allowManualReview }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('status', () => {
    it('should call request with correct parameters', async () => {
      // Arrange
      const jobId = 123;
      const mockResponse = { 
        status: 'success',
        job_status: 'complete',
        total_records: 100
      };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.status(jobId);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'GET', path: 'jobs/status' },
        { job_id: jobId }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('results', () => {
    it('should call request with correct parameters when no query is provided', async () => {
      // Arrange
      const jobId = 123;
      const mockResponse = { 
        status: 'success',
        results: []
      };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.results(jobId);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'GET', path: 'jobs/results' },
        { job_id: jobId }
      );
      expect(result).toBe(mockResponse);
    });

    it('should call request with correct parameters when query is provided', async () => {
      // Arrange
      const jobId = 123;
      const query = { page: 1, per_page: 10 };
      const mockResponse = { 
        status: 'success',
        results: []
      };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.results(jobId, query);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'GET', path: 'jobs/results' },
        { job_id: jobId, ...query }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('download', () => {
    it('should call request with correct parameters when no query is provided', async () => {
      // Arrange
      const jobId = 123;
      const mockResponse = 'email,result\ntest@example.com,valid';
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.download(jobId);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { 
          acceptedType: 'application/octet-stream',
          method: 'GET', 
          path: 'jobs/download' 
        },
        { job_id: jobId }
      );
      expect(result).toBe(mockResponse);
    });

    it('should call request with correct parameters when query is provided', async () => {
      // Arrange
      const jobId = 123;
      const query = { bounce_flags: true };
      const mockResponse = 'email,result,bounce_flags\ntest@example.com,valid,none';
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.download(jobId, query);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { 
          acceptedType: 'application/octet-stream',
          method: 'GET', 
          path: 'jobs/download' 
        },
        { job_id: jobId, ...query }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('delete', () => {
    it('should call request with correct parameters', async () => {
      // Arrange
      const jobId = 123;
      const mockResponse = { status: 'success' };
      jobs.request.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await jobs.delete(jobId);

      // Assert
      expect(jobs.request).toHaveBeenCalledWith(
        { method: 'POST', path: 'jobs/delete' },
        { job_id: jobId }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('Static properties', () => {
    it('should have correct input type constants', () => {
      expect(Jobs.remote).toBe('remote_url');
      expect(Jobs.supplied).toBe('supplied');
    });

    it('should have correct helpers object', () => {
      expect(Jobs.helpers.inputType.remote).toBe('remote_url');
      expect(Jobs.helpers.inputType.supplied).toBe('supplied');
      expect(Jobs.helpers.status.under_review).toBe('under_review');
      expect(Jobs.helpers.status.queued).toBe('queued');
      expect(Jobs.helpers.status.failed).toBe('failed');
      expect(Jobs.helpers.status.complete).toBe('complete');
      expect(Jobs.helpers.status.running).toBe('running');
      expect(Jobs.helpers.status.parsing).toBe('parsing');
      expect(Jobs.helpers.status.waiting).toBe('waiting');
      expect(Jobs.helpers.status.waiting_analyzed).toBe('waiting_analyzed');
      expect(Jobs.helpers.status.uploading).toBe('uploading');
    });
  });
});
