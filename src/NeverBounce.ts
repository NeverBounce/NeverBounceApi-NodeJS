import { NeverBounceConfig, RequestOptions } from './types.js';

// Import resource classes
import Account from './Account.js';
import Jobs from './Jobs.js';
import POE from './POE.js';
import Single from './Single.js';
import VerificationObject from './VerificationObject.js';
import _Error from './Errors.js';

/**
 * Main NeverBounce API client class
 */
class NeverBounce {
  /**
   * Resource instances
   */
  public account: Account;
  public jobs: Jobs;
  public poe: POE;
  public single: Single;

  /**
   * Default config values
   */
  static readonly defaultConfig: NeverBounceConfig = {
    apiVersion: 'v4.2',
    apiKey: null,
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
  };

  /**
   * Verification result helpers
   */
  static readonly result = VerificationObject.helpers;

  /**
   * Job helpers
   */
  static readonly job = Jobs.helpers;

  /**
   * Error types
   */
  static readonly errors = _Error;

  /**
   * Configuration
   */
  private config: NeverBounceConfig;

  /**
   * Initializes NeverBounce object
   * @param config Configuration options
   */
  constructor(config: Partial<NeverBounceConfig> = {}) {
    // Create config by merging defaults with user config
    this.config = {
      ...structuredClone(NeverBounce.defaultConfig),
      ...config,
      opts: {
        ...NeverBounce.defaultConfig.opts,
        ...(config.opts || {}),
        headers: {
          ...NeverBounce.defaultConfig.opts.headers,
          ...(config.opts?.headers || {})
        }
      }
    };
    
    // Initialize resources
    this.account = new Account(this);
    this.jobs = new Jobs(this);
    this.poe = new POE(this);
    this.single = new Single(this);
  }

  /**
   * Returns config
   */
  getConfig(): NeverBounceConfig {
    return this.config;
  }

  /**
   * Make request options
   */
  getRequestOpts(opts: Partial<RequestOptions> = {}): RequestOptions {
    return {
      ...this.config.opts,
      ...opts,
      headers: {
        ...this.config.opts.headers,
        ...(opts.headers || {})
      }
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<NeverBounceConfig>): void {
    if (config.apiKey) this.config.apiKey = config.apiKey;
    if (config.apiVersion) this.config.apiVersion = config.apiVersion;
    if (config.timeout) this.config.timeout = config.timeout;
    
    if (config.opts) {
      this.config.opts = {
        ...this.config.opts,
        ...config.opts,
        headers: {
          ...this.config.opts.headers,
          ...(config.opts.headers || {})
        }
      };
    }
  }

  /**
   * Set api key (convenience method)
   * @param key API key
   */
  setApiKey(key: string): void {
    this.config.apiKey = key;
  }

  /**
   * Set api host (convenience method)
   * @param host API host
   */
  setHost(host: string): void {
    this.config.opts.host = host;
  }
}

export default NeverBounce;
