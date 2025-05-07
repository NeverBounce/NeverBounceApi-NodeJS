import { ErrorType } from './types.js';

// Add Node.js specific Error interface extension
declare global {
  interface ErrorConstructor {
    captureStackTrace?(targetObject: object, constructorOpt?: Function): void;
  }
}

/**
 * NeverBounce API Error class
 */
class _Error extends Error {
  public name: string;
  public type: string;
  public message: string;

  /**
   * Error constructor
   * @param type Error type
   * @param message Error message
   */
  constructor(type?: string, message?: string) {
    super(message || 'General Error');
    this.name = 'NeverBounce Error';
    this.type = type || 'GeneralError';
    this.message = message || 'General Error';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _Error);
    }
  }

  /**
   * Error type constants
   */
  static readonly AuthError: string = 'AuthError';
  static readonly BadReferrerError: string = 'BadReferrerError';
  static readonly GeneralError: string = 'GeneralError'; // Fallback error
  static readonly ThrottleError: string = 'ThrottleError';

  /**
   * Error lookup table
   */
  static readonly _lut: Record<string, string> = {
    'general_failure': _Error.GeneralError, // Fallback error
    'auth_failure': _Error.AuthError,
    'bad_referrer': _Error.BadReferrerError,
    'throttle_triggered': _Error.ThrottleError,
  };
}

export default _Error;
