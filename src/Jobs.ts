import HttpsClient from './HttpsClient.js';
import { 
  ApiResponse,
  JobCreationRequest, 
  JobCreationResponse, 
  JobDeleteResponse, 
  JobDownloadRequest, 
  JobResultsRequest, 
  JobResultsResponse, 
  JobSearchRequest, 
  JobSearchResponse, 
  JobStatusResponse 
} from './types.js';

/**
 * Jobs API endpoints
 */
class Jobs extends HttpsClient {
  /**
   * Search for jobs
   * @param query Search query parameters
   * @returns Promise with search results
   */
  async search(query?: JobSearchRequest): Promise<JobSearchResponse> {
    return this.request<JobSearchResponse>({
      method: 'GET',
      path: 'jobs/search'
    }, query || {});
  }

  /**
   * Creates a job
   * @param input Input data (array of emails or remote URL)
   * @param inputlocation Input location type ('remote_url' or 'supplied')
   * @param filename Filename for the job
   * @param runsample Whether to run a sample
   * @param autoparse Whether to automatically parse
   * @param autostart Whether to automatically start
   * @param historicalData Whether to leverage historical data
   * @param allowManualReview Whether to allow manual review
   * @param callbackUrl URL to call when job completes
   * @param callbackHeaders Headers to include in callback request
   * @returns Promise with job creation response
   */
  async create(
    input: any[] | string,
    inputlocation?: string,
    filename?: string,
    runsample?: boolean,
    autoparse?: boolean,
    autostart?: boolean,
    historicalData?: boolean,
    allowManualReview?: boolean,
    callbackUrl?: string,
    callbackHeaders?: Record<string, string>
  ): Promise<JobCreationResponse> {
    const data: JobCreationRequest & { 
      request_meta_data?: { leverage_historical_data: number };
      allow_manual_review?: boolean | null;
      callback_url?: string | null;
      callback_headers?: Record<string, string> | null;
    } = {
      input: Array.isArray(input) ? input : [input],
      input_location: inputlocation,
      filename,
      run_sample: runsample || null,
      auto_start: autostart || null,
      auto_parse: autoparse || null,
      allow_manual_review: allowManualReview || null,
      callback_url: callbackUrl || null,
      callback_headers: callbackHeaders || null
    };

    if (historicalData !== undefined) {
      data.request_meta_data = { leverage_historical_data: historicalData ? 1 : 0 };
    }

    return this.request<JobCreationResponse>({
      method: 'POST',
      path: 'jobs/create'
    }, data);
  }

  /**
   * Starts parsing job after creation
   * @param jobid Job ID
   * @param autostart Whether to automatically start
   * @returns Promise with parse response
   */
  async parse(jobid: number, autostart?: boolean): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'POST',
      path: 'jobs/parse'
    }, {
      job_id: jobid,
      auto_start: autostart || undefined
    });
  }

  /**
   * Starts job waiting to be started
   * @param jobid Job ID
   * @param runsample Whether to run a sample
   * @param allowManualReview Whether to allow manual review
   * @returns Promise with start response
   */
  async start(jobid: number, runsample?: boolean, allowManualReview?: boolean): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'POST',
      path: 'jobs/start'
    }, {
      job_id: jobid,
      run_sample: runsample || undefined,
      allow_manual_review: allowManualReview || undefined
    });
  }

  /**
   * Gets job status
   * @param jobid Job ID
   * @returns Promise with job status
   */
  async status(jobid: number): Promise<JobStatusResponse> {
    return this.request<JobStatusResponse>({
      method: 'GET',
      path: 'jobs/status'
    }, {
      job_id: jobid
    });
  }

  /**
   * Retrieves job results
   * @param jobid Job ID
   * @param query Additional query parameters
   * @returns Promise with job results
   */
  async results(jobid: number, query?: Omit<JobResultsRequest, 'job_id'>): Promise<JobResultsResponse> {
    return this.request<JobResultsResponse>({
      method: 'GET',
      path: 'jobs/results'
    }, Object.assign({ job_id: jobid }, query || {}));
  }

  /**
   * Downloads results as CSV
   * @param jobid Job ID
   * @param query Additional query parameters
   * @returns Promise with CSV data
   */
  async download(jobid: number, query?: Omit<JobDownloadRequest, 'job_id'>): Promise<string> {
    return this.request<any>({
      acceptedType: 'application/octet-stream',
      method: 'GET',
      path: 'jobs/download'
    }, Object.assign({ job_id: jobid }, query || {}));
  }

  /**
   * Deletes a job
   * @param jobid Job ID
   * @returns Promise with delete response
   */
  async delete(jobid: number): Promise<JobDeleteResponse> {
    return this.request<JobDeleteResponse>({
      method: 'POST',
      path: 'jobs/delete'
    }, {
      job_id: jobid
    });
  }

  /**
   * Job input type constants
   */
  static readonly remote: string = 'remote_url';
  static readonly supplied: string = 'supplied';

  /**
   * Helper object for job types and statuses
   * @since 4.1.4
   */
  static readonly helpers = {
    inputType: {
      remote: Jobs.remote,
      supplied: Jobs.supplied
    },
    status: {
      under_review: 'under_review',
      queued: 'queued',
      failed: 'failed',
      complete: 'complete',
      running: 'running',
      parsing: 'parsing',
      waiting: 'waiting',
      waiting_analyzed: 'waiting_analyzed',
      uploading: 'uploading'
    }
  };
}

export default Jobs;
