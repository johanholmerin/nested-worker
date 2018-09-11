import noSupport from './worker-no-support.js';
import support from './worker-support.js';

/**
 * Because it's not possible to check support for nested workers in the window
 * scope, message handling must be overriden regardless. Creation of workers is
 * however left to the native implementation when possible.
 */
const supportsNestedWorker = typeof Worker === 'function';

if (supportsNestedWorker) {
  support();
} else {
  noSupport();
}
