/// <reference types="jest" />

import { describe, it, expect } from '@jest/globals';
import VerificationObject from '../src/VerificationObject.js';
import { SingleVerificationResponse } from '../src/types.js';

describe('VerificationObject', () => {
  // Sample verification response
  const validResponse: SingleVerificationResponse = {
    status: 'success',
    result: 0,
    flags: ['has_dns', 'has_dns_mx', 'smtp_connectable'],
    execution_time: 123,
    address_info: {
      original: 'test@example.com',
      normalized: 'test@example.com',
      addr: 'test',
      alias: '',
      host: 'example.com',
      fqdn: 'example.com',
      domain: 'example',
      subdomain: '',
      tld: 'com'
    },
    credits_info: {
      paid_credits_used: 1,
      free_credits_used: 0,
      paid_credits_remaining: 999,
      free_credits_remaining: 0
    }
  };

  // Sample invalid response for testing
  const invalidResponse: SingleVerificationResponse = {
    status: 'success',
    result: 1,
    flags: ['bad_syntax'],
    execution_time: 123
  };

  // Use invalidResponse in a test to avoid unused variable warning
  it('should handle invalid responses', () => {
    const verificationObject = new VerificationObject(invalidResponse);
    expect(verificationObject.getResult()).toBe(1);
    expect(verificationObject.hasFlag('bad_syntax')).toBe(true);
  });

  describe('constructor', () => {
    it('should initialize with the provided response', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.getResponse()).toBe(validResponse);
    });
  });

  describe('getResult', () => {
    it('should return the result from the response', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.getResult()).toBe(0);
    });
  });

  describe('getNumericResult', () => {
    it('should return the numeric result for a text result', () => {
      // Create a response with a text result
      const textResponse = { ...validResponse, result: 'valid' as unknown as number };
      const verificationObject = new VerificationObject(textResponse);
      
      // Mock the static property access
      const originalValid = VerificationObject.valid;
      (VerificationObject as any).valid = 0;
      
      expect(verificationObject.getNumericResult()).toBe(0);
      
      // Restore the original value
      (VerificationObject as any).valid = originalValid;
    });

    it('should return the text result for a numeric result', () => {
      const verificationObject = new VerificationObject(validResponse);
      
      // Mock the static property access
      const originalHelper = VerificationObject.helpers;
      (VerificationObject as any)[0] = 'valid';
      
      expect(verificationObject.getNumericResult()).toBe('valid');
      
      // Restore the original value
      (VerificationObject as any).helpers = originalHelper;
    });
  });

  describe('is', () => {
    it('should return true if the result matches the specified code', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.is(0)).toBe(true);
      expect(verificationObject.is('valid')).toBe(true);
    });

    it('should return true if the result matches any of the specified codes', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.is([0, 1])).toBe(true);
      expect(verificationObject.is(['valid', 'invalid'])).toBe(true);
    });

    it('should return false if the result does not match the specified code', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.is(1)).toBe(false);
      expect(verificationObject.is('invalid')).toBe(false);
    });

    it('should return false if the result does not match any of the specified codes', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.is([1, 2])).toBe(false);
      expect(verificationObject.is(['invalid', 'disposable'])).toBe(false);
    });
  });

  describe('not', () => {
    it('should return false if the result matches the specified code', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.not(0)).toBe(false);
      expect(verificationObject.not('valid')).toBe(false);
    });

    it('should return false if the result matches any of the specified codes', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.not([0, 1])).toBe(false);
      expect(verificationObject.not(['valid', 'invalid'])).toBe(false);
    });

    it('should return true if the result does not match the specified code', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.not(1)).toBe(true);
      expect(verificationObject.not('invalid')).toBe(true);
    });

    it('should return true if the result does not match any of the specified codes', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.not([1, 2])).toBe(true);
      expect(verificationObject.not(['invalid', 'disposable'])).toBe(true);
    });
  });

  describe('hasFlag', () => {
    it('should return true if the flag is present', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.hasFlag('has_dns')).toBe(true);
      expect(verificationObject.hasFlag('has_dns_mx')).toBe(true);
      expect(verificationObject.hasFlag('smtp_connectable')).toBe(true);
    });

    it('should return false if the flag is not present', () => {
      const verificationObject = new VerificationObject(validResponse);
      expect(verificationObject.hasFlag('bad_syntax')).toBe(false);
      expect(verificationObject.hasFlag('disposable_email')).toBe(false);
    });

    it('should return false if the response has no flags', () => {
      const noFlagsResponse = { ...validResponse, flags: [] };
      const verificationObject = new VerificationObject(noFlagsResponse);
      expect(verificationObject.hasFlag('has_dns')).toBe(false);
    });
  });

  describe('static properties', () => {
    it('should expose result code constants', () => {
      expect(VerificationObject.valid).toBe(0);
      expect(VerificationObject.invalid).toBe(1);
      expect(VerificationObject.disposable).toBe(2);
      expect(VerificationObject.catchall).toBe(3);
      expect(VerificationObject.unknown).toBe(4);
    });

    it('should expose helpers object with result codes and flags', () => {
      expect(VerificationObject.helpers.valid).toBe(0);
      expect(VerificationObject.helpers.invalid).toBe(1);
      expect(VerificationObject.helpers.disposable).toBe(2);
      expect(VerificationObject.helpers.catchall).toBe(3);
      expect(VerificationObject.helpers.unknown).toBe(4);
      
      expect(VerificationObject.helpers[0]).toBe('valid');
      expect(VerificationObject.helpers[1]).toBe('invalid');
      expect(VerificationObject.helpers[2]).toBe('disposable');
      expect(VerificationObject.helpers[3]).toBe('catchall');
      expect(VerificationObject.helpers[4]).toBe('unknown');
      
      expect(VerificationObject.helpers.flags.has_dns).toBe('has_dns');
      expect(VerificationObject.helpers.flags.has_dns_mx).toBe('has_dns_mx');
      expect(VerificationObject.helpers.flags.bad_syntax).toBe('bad_syntax');
      // Check a few more flags
      expect(VerificationObject.helpers.flags.free_email_host).toBe('free_email_host');
      expect(VerificationObject.helpers.flags.disposable_email).toBe('disposable_email');
    });

    it('should expose deprecated numericCodes object', () => {
      expect(VerificationObject.numericCodes.valid).toBe(0);
      expect(VerificationObject.numericCodes.invalid).toBe(1);
      expect(VerificationObject.numericCodes.disposable).toBe(2);
      expect(VerificationObject.numericCodes.catchall).toBe(3);
      expect(VerificationObject.numericCodes.unknown).toBe(4);
    });
  });
});
