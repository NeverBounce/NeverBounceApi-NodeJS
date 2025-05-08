/// <reference types="jest" />

import { describe, it, expect } from '@jest/globals';
import NeverBounce from '../src/NeverBounce.js';
import Account from '../src/Account.js';
import Jobs from '../src/Jobs.js';
import POE from '../src/POE.js';
import Single from '../src/Single.js';
import { NeverBounceConfig } from '../src/types.js';

describe('NeverBounce', () => {
  describe('constructor', () => {
    it('should initialize with default config when no config is provided', () => {
      const nb = new NeverBounce();
      const config = nb.getConfig();
      
      expect(config.apiVersion).toBe('v4.2');
      expect(config.apiKey).toBeNull();
      expect(config.timeout).toBe(30000);
      expect(config.opts.host).toBe('api.neverbounce.com');
      expect(config.opts.port).toBe(443);
      expect(config.opts.headers['Content-Type']).toBe('application/json');
      expect(config.opts.headers['User-Agent']).toBe('NeverBounce-Node/5.0.0');
    });

    it('should merge provided config with default config', () => {
      const customConfig: Partial<NeverBounceConfig> = {
        apiKey: 'test-api-key',
        timeout: 60000,
        opts: {
          acceptedType: 'application/json',
          host: 'custom.api.neverbounce.com',
          port: 443,
          headers: {
            'Custom-Header': 'custom-value'
          }
        }
      };
      
      const nb = new NeverBounce(customConfig);
      const config = nb.getConfig();
      
      expect(config.apiKey).toBe('test-api-key');
      expect(config.timeout).toBe(60000);
      expect(config.opts.host).toBe('custom.api.neverbounce.com');
      expect(config.opts.port).toBe(443); // Default value
      expect(config.opts.headers['Content-Type']).toBe('application/json'); // Default value
      expect(config.opts.headers['Custom-Header']).toBe('custom-value'); // Custom value
    });

    it('should initialize resource instances', () => {
      const nb = new NeverBounce();
      
      expect(nb.account).toBeInstanceOf(Account);
      expect(nb.jobs).toBeInstanceOf(Jobs);
      expect(nb.poe).toBeInstanceOf(POE);
      expect(nb.single).toBeInstanceOf(Single);
    });
  });

  describe('getRequestOpts', () => {
    it('should return request options with merged headers', () => {
      const nb = new NeverBounce({
        opts: {
          acceptedType: 'application/json',
          host: 'api.neverbounce.com',
          port: 443,
          headers: {
            'Default-Header': 'default-value'
          }
        }
      });
      
      const opts = nb.getRequestOpts({
        method: 'POST',
        path: 'test/path',
        headers: {
          'Custom-Header': 'custom-value'
        }
      });
      
      expect(opts.method).toBe('POST');
      expect(opts.path).toBe('test/path');
      expect(opts.headers['Default-Header']).toBe('default-value');
      expect(opts.headers['Custom-Header']).toBe('custom-value');
      expect(opts.headers['Content-Type']).toBe('application/json'); // From default config
    });
  });

  describe('updateConfig', () => {
    it('should update config values', () => {
      const nb = new NeverBounce();
      
      nb.updateConfig({
        apiKey: 'updated-api-key',
        apiVersion: 'v5.0',
        timeout: 45000,
        opts: {
          acceptedType: 'application/json',
          host: 'updated.api.neverbounce.com',
          port: 443,
          headers: {
            'Updated-Header': 'updated-value'
          }
        }
      });
      
      const config = nb.getConfig();
      
      expect(config.apiKey).toBe('updated-api-key');
      expect(config.apiVersion).toBe('v5.0');
      expect(config.timeout).toBe(45000);
      expect(config.opts.host).toBe('updated.api.neverbounce.com');
      expect(config.opts.headers['Updated-Header']).toBe('updated-value');
      expect(config.opts.headers['Content-Type']).toBe('application/json'); // Preserved from default
    });

    it('should only update provided config values', () => {
      const nb = new NeverBounce({
        apiKey: 'initial-api-key',
        timeout: 30000
      });
      
      nb.updateConfig({
        timeout: 45000
      });
      
      const config = nb.getConfig();
      
      expect(config.apiKey).toBe('initial-api-key'); // Unchanged
      expect(config.timeout).toBe(45000); // Updated
    });
  });

  describe('setApiKey', () => {
    it('should update the API key', () => {
      const nb = new NeverBounce();
      
      nb.setApiKey('new-api-key');
      
      expect(nb.getConfig().apiKey).toBe('new-api-key');
    });
  });

  describe('setHost', () => {
    it('should update the API host', () => {
      const nb = new NeverBounce();
      
      nb.setHost('new.api.neverbounce.com');
      
      expect(nb.getConfig().opts.host).toBe('new.api.neverbounce.com');
    });
  });

  describe('static properties', () => {
    it('should expose result helpers', () => {
      expect(NeverBounce.result.valid).toBe(0);
      expect(NeverBounce.result.invalid).toBe(1);
      expect(NeverBounce.result.disposable).toBe(2);
      expect(NeverBounce.result.catchall).toBe(3);
      expect(NeverBounce.result.unknown).toBe(4);
    });

    it('should expose job helpers', () => {
      expect(NeverBounce.job.inputType.remote).toBe('remote_url');
      expect(NeverBounce.job.inputType.supplied).toBe('supplied');
      expect(NeverBounce.job.status.complete).toBe('complete');
      expect(NeverBounce.job.status.failed).toBe('failed');
      expect(NeverBounce.job.status.queued).toBe('queued');
      expect(NeverBounce.job.status.running).toBe('running');
      expect(NeverBounce.job.status.parsing).toBe('parsing');
      expect(NeverBounce.job.status.waiting).toBe('waiting');
      expect(NeverBounce.job.status.waiting_analyzed).toBe('waiting_analyzed');
      expect(NeverBounce.job.status.uploading).toBe('uploading');
      expect(NeverBounce.job.status.under_review).toBe('under_review');
    });

    it('should expose error types', () => {
      expect(NeverBounce.errors.AuthError).toBe('AuthError');
      expect(NeverBounce.errors.BadReferrerError).toBe('BadReferrerError');
      expect(NeverBounce.errors.GeneralError).toBe('GeneralError');
      expect(NeverBounce.errors.ThrottleError).toBe('ThrottleError');
    });
  });
});
