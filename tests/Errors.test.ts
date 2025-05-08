/// <reference types="jest" />

import { describe, it, expect } from '@jest/globals';
import _Error from '../src/Errors.js';

describe('_Error', () => {
  describe('constructor', () => {
    it('should create an error with default values when no parameters are provided', () => {
      const error = new _Error();
      
      expect(error.name).toBe('NeverBounce Error');
      expect(error.type).toBe('GeneralError');
      expect(error.message).toBe('General Error');
      expect(error instanceof Error).toBe(true);
    });

    it('should create an error with the provided type and default message', () => {
      const error = new _Error('AuthError');
      
      expect(error.name).toBe('NeverBounce Error');
      expect(error.type).toBe('AuthError');
      expect(error.message).toBe('General Error');
    });

    it('should create an error with the provided type and message', () => {
      const error = new _Error('AuthError', 'Invalid API key');
      
      expect(error.name).toBe('NeverBounce Error');
      expect(error.type).toBe('AuthError');
      expect(error.message).toBe('Invalid API key');
    });
  });

  describe('static properties', () => {
    it('should expose error type constants', () => {
      expect(_Error.AuthError).toBe('AuthError');
      expect(_Error.BadReferrerError).toBe('BadReferrerError');
      expect(_Error.GeneralError).toBe('GeneralError');
      expect(_Error.ThrottleError).toBe('ThrottleError');
    });

    it('should have a lookup table for error types', () => {
      expect(_Error._lut['auth_failure']).toBe(_Error.AuthError);
      expect(_Error._lut['bad_referrer']).toBe(_Error.BadReferrerError);
      expect(_Error._lut['general_failure']).toBe(_Error.GeneralError);
      expect(_Error._lut['throttle_triggered']).toBe(_Error.ThrottleError);
    });
  });
});
