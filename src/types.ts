/**
 * Common type definitions for the NeverBounce API
 */

/**
 * NeverBounce API Configuration
 */
export interface NeverBounceConfig {
  apiVersion: string;
  apiKey: string | null;
  timeout: number;
  opts: RequestOptions;
}

/**
 * HTTP Request Options
 */
export interface RequestOptions {
  acceptedType: string;
  host: string;
  port: number;
  headers: Record<string, string>;
  path?: string;
  method?: string;
}

/**
 * API Response
 */
export interface ApiResponse {
  status: string;
  message?: string;
  execution_time?: number;
  [key: string]: any;
}

/**
 * Verification Result Codes
 */
export enum VerificationResult {
  Valid = 0,
  Invalid = 1,
  Disposable = 2,
  Catchall = 3,
  Unknown = 4
}

/**
 * Verification Flags
 */
export interface VerificationFlags {
  has_dns: string;
  has_dns_mx: string;
  bad_syntax: string;
  free_email_host: string;
  profanity: string;
  role_account: string;
  disposable_email: string;
  government_host: string;
  academic_host: string;
  military_host: string;
  international_host: string;
  squatter_host: string;
  spelling_mistake: string;
  bad_dns: string;
  temporary_dns_error: string;
  connect_fails: string;
  accepts_all: string;
  contains_alias: string;
  contains_subdomain: string;
  smtp_connectable: string;
  spamtrap_network: string;
}

/**
 * Job Input Types
 */
export enum JobInputType {
  RemoteUrl = 'remote_url',
  Supplied = 'supplied'
}

/**
 * Job Status Types
 */
export enum JobStatus {
  UnderReview = 'under_review',
  Queued = 'queued',
  Failed = 'failed',
  Complete = 'complete',
  Running = 'running',
  Parsing = 'parsing',
  Waiting = 'waiting',
  WaitingAnalyzed = 'waiting_analyzed',
  Uploading = 'uploading'
}

/**
 * Error Types
 */
export enum ErrorType {
  AuthError = 'auth_failure',
  BadReferrerError = 'bad_referrer',
  GeneralError = 'general_failure',
  ThrottleError = 'throttle_triggered'
}

/**
 * Single Verification Request
 */
export interface SingleVerificationRequest {
  email: string;
  address_info?: boolean;
  credits_info?: boolean;
  timeout?: number;
}

/**
 * Single Verification Response
 */
export interface SingleVerificationResponse extends ApiResponse {
  result: number;
  flags: string[];
  suggested_correction?: string;
  retry_token?: string;
  address_info?: {
    original: string;
    normalized: string;
    addr: string;
    alias: string;
    host: string;
    fqdn: string;
    domain: string;
    subdomain: string;
    tld: string;
  };
  credits_info?: {
    paid_credits_used: number;
    free_credits_used: number;
    paid_credits_remaining: number;
    free_credits_remaining: number;
  };
}

/**
 * Account Info Response
 */
export interface AccountInfoResponse extends ApiResponse {
  billing_type: string;
  credits: {
    paid_credits_used: number;
    free_credits_used: number;
    paid_credits_remaining: number;
    free_credits_remaining: number;
  };
  job_counts: {
    completed: number;
    processing: number;
    queued: number;
    under_review: number;
  };
}

/**
 * POE Confirmation Request
 */
export interface POEConfirmationRequest {
  email: string;
  transaction_id: string;
  confirmation_token: string;
  result: number;
}

/**
 * POE Confirmation Response
 */
export interface POEConfirmationResponse extends ApiResponse {
  token_confirmed: boolean;
  token_age: number;
}

/**
 * Job Creation Request
 */
export interface JobCreationRequest {
  input: string[];
  input_location?: string;
  auto_parse?: boolean | null;
  auto_start?: boolean | null;
  run_sample?: boolean | null;
  filename?: string;
}

/**
 * Job Creation Response
 */
export interface JobCreationResponse extends ApiResponse {
  job_id: number;
}

/**
 * Job Status Response
 */
export interface JobStatusResponse extends ApiResponse {
  id: number;
  filename: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  total: {
    processed: number;
    valid: number;
    invalid: number;
    catchall: number;
    disposable: number;
    unknown: number;
    duplicates: number;
    bad_syntax: number;
  };
  job_status: string;
  bounce_estimate: number | null;
  percent_complete: number;
  failure_reason: string | null;
}

/**
 * Job Results Request
 */
export interface JobResultsRequest {
  job_id: number;
  page?: number;
  per_page?: number;
  include_verification_time?: boolean;
}

/**
 * Job Results Response
 */
export interface JobResultsResponse extends ApiResponse {
  total_results: number;
  total_pages: number;
  query: {
    job_id: number;
    valids: boolean;
    invalids: boolean;
    catchalls: boolean;
    disposables: boolean;
    unknowns: boolean;
    page: number;
    items_per_page: number;
  };
  results: Array<{
    data: Record<string, any>;
    verification: {
      result: number;
      flags: string[];
      suggested_correction: string | null;
      address_info: {
        original: string;
        normalized: string;
        addr: string;
        alias: string;
        host: string;
        fqdn: string;
        domain: string;
        subdomain: string;
        tld: string;
      };
      verification_time?: number;
    };
  }>;
}

/**
 * Job Search Request
 */
export interface JobSearchRequest {
  job_id?: number;
  page?: number;
  per_page?: number;
}

/**
 * Job Search Response
 */
export interface JobSearchResponse extends ApiResponse {
  total_results: number;
  total_pages: number;
  query: {
    page: number;
    items_per_page: number;
  };
  results: Array<{
    id: number;
    job_status: string;
    filename: string;
    created_at: string;
    started_at: string | null;
    finished_at: string | null;
    total: {
      processed: number;
      valid: number;
      invalid: number;
      catchall: number;
      disposable: number;
      unknown: number;
      duplicates: number;
      bad_syntax: number;
    };
    bounce_estimate: number | null;
    percent_complete: number;
    failure_reason: string | null;
  }>;
}

/**
 * Job Delete Response
 */
export interface JobDeleteResponse extends ApiResponse {
  job_id: number;
}

/**
 * Job Download Request
 */
export interface JobDownloadRequest {
  job_id: number;
}

/**
 * Resource Class Constructor
 */
export interface ResourceConstructor {
  new (client: any): any;
}

/**
 * Resources Map
 */
export interface ResourcesMap {
  [key: string]: ResourceConstructor;
}
