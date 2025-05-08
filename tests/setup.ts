// This file is used to set up the Jest environment for TypeScript
// It's referenced in the jest.config.js file

// Make Jest functions globally available for ES modules
import { jest } from '@jest/globals';

// Explicitly make jest available globally
global.jest = jest;
