import { SingleVerificationResponse, VerificationFlags } from './types.js';

/**
 * Verification Object class for handling verification results
 */
class VerificationObject {
  private response: SingleVerificationResponse;

  /**
   * Constructor
   * @param response Verification response from API
   */
  constructor(response: SingleVerificationResponse) {
    this.response = response;
  }

  /**
   * Get the full response object
   * @returns The verification response
   */
  getResponse(): SingleVerificationResponse {
    return this.response;
  }

  /**
   * Returns result
   * @returns The verification result
   */
  getResult(): string | number {
    return this.response.result;
  }

  /**
   * Returns text code
   * @returns The numeric result code
   */
  getNumericResult(): number | string {
    return (VerificationObject as any)[this.getResult()];
  }

  /**
   * Returns true if result is of specified types
   * @param codes Verification result codes to check
   * @returns Whether the result matches any of the specified codes
   */
  is(codes: string | number | Array<string | number>): boolean {
    if (Array.isArray(codes)) {
      return (codes.indexOf(this.getResult() as any) > -1 || codes.indexOf(this.getNumericResult() as any) > -1);
    } else {
      return (codes === this.getResult() || codes === this.getNumericResult());
    }
  }

  /**
   * Returns true if result is NOT of specified types
   * @param codes Verification result codes to check
   * @returns Whether the result does not match any of the specified codes
   */
  not(codes: string | number | Array<string | number>): boolean {
    if (Array.isArray(codes)) {
      return (codes.indexOf(this.getResult() as any) === -1 && codes.indexOf(this.getNumericResult() as any) === -1);
    } else {
      return (codes !== this.getResult() && codes !== this.getNumericResult());
    }
  }

  /**
   * Returns true if the flag was returned
   * @param flag Flag to check
   * @returns Whether the flag is present
   */
  hasFlag(flag: string): boolean {
    return this.response
      && this.response.flags
      && this.response.flags.indexOf(flag) > -1;
  }

  /**
   * Result code constants
   */
  static readonly valid: number = 0;
  static readonly invalid: number = 1;
  static readonly disposable: number = 2;
  static readonly catchall: number = 3;
  static readonly unknown: number = 4;

  /**
   * Helper object for result codes and flags
   * @since 4.1.4
   */
  static readonly helpers: {
    [key: string]: any;
    [key: number]: string;
    valid: number;
    invalid: number;
    disposable: number;
    catchall: number;
    unknown: number;
    flags: VerificationFlags;
  } = {
    // Numerically indexed
    [VerificationObject.valid]: 'valid',
    [VerificationObject.invalid]: 'invalid',
    [VerificationObject.disposable]: 'disposable',
    [VerificationObject.catchall]: 'catchall',
    [VerificationObject.unknown]: 'unknown',

    // Text indexed
    valid: VerificationObject.valid,
    invalid: VerificationObject.invalid,
    disposable: VerificationObject.disposable,
    catchall: VerificationObject.catchall,
    unknown: VerificationObject.unknown,

    flags: {
      has_dns: 'has_dns',
      has_dns_mx: 'has_dns_mx',
      bad_syntax: 'bad_syntax',
      free_email_host: 'free_email_host',
      profanity: 'profanity',
      role_account: 'role_account',
      disposable_email: 'disposable_email',
      government_host: 'government_host',
      academic_host: 'academic_host',
      military_host: 'military_host',
      international_host: 'international_host',
      squatter_host: 'squatter_host',
      spelling_mistake: 'spelling_mistake',
      bad_dns: 'bad_dns',
      temporary_dns_error: 'temporary_dns_error',
      connect_fails: 'connect_fails',
      accepts_all: 'accepts_all',
      contains_alias: 'contains_alias',
      contains_subdomain: 'contains_subdomain',
      smtp_connectable: 'smtp_connectable',
      spamtrap_network: 'spamtrap_network',
    }
  };

  /**
   * @deprecated 4.1.4 Will be removed in next minor release
   */
  static readonly numericCodes: Record<string, number> = {
    valid: VerificationObject.valid,
    invalid: VerificationObject.invalid,
    disposable: VerificationObject.disposable,
    catchall: VerificationObject.catchall,
    unknown: VerificationObject.unknown,
  };
}

export default VerificationObject;
