import { connect } from './messages.js';

function objOrFunc(val) {
  const type = typeof val;
  return type === 'function' || type === 'object';
}

function assert(value, error) {
  if (!value) throw error;
}

export function addPropertyListener(obj, name) {
  const valueKey = `_on${name}`;

  Object.defineProperty(obj, `on${name}`, {
    set(value) {
      if (objOrFunc(this[valueKey])) {
        this.removeEventListener(name, this[valueKey]);
      }

      this[valueKey] = value;
      if (objOrFunc(value)) this.addEventListener(name, this[valueKey]);
    },
    get() {
      return this[valueKey];
    }
  });
}

/**
 * Overrides global message handling with a MessagePort.
 * Sends remote port to parent, returns local port.
 */
export function setupWorkerScope({ postMessage }) {
  const { port1, port2 } = new MessageChannel();

  // Send port to parent
  postMessage(...connect({ port: port2, id: 0 }));

  // Functions
  Object.assign(self, {
    postMessage: (...args) => port1.postMessage(...args),
    addEventListener: (...args) => port1.addEventListener(...args),
    removeEventListener: (...args) => port1.removeEventListener(...args)
  });

  // Property listeners
  Object.defineProperties(self, {
    onmessageerror: {
      set: value => port1.onmessageerror = value,
      get: () => port1.onmessageerror
    },
    onmessage: {
      set: value => port1.onmessage = value,
      get: () => port1.onmessage
    }
  });

  return port1;
}

/**
 * Generate random id for Workers
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const RequestCredentials = ['omit', 'same-origin', 'include'];
const WorkerType = ['classic', 'module'];

/**
 * Verify and normalize Worker arguments
 */
export function parseWorkerArgs(url, {
  type = 'classic',
  credentials = 'omit',
  name
} = {}) {
  assert(url !== undefined, new TypeError('URL is required'));
  const parsedURL = new URL(url, location.href);

  // Throw an error if url is of other origin.
  // According to spec an error event should now be raised instead of throwing
  // an exception, but this follows the behavior of the browsers where this
  // polyfill is needed.
  assert(
    parsedURL.origin === location.origin,
    new DOMException(
      `Failed to create Worker of origin '${parsedURL.origin}'`,
      DOMException.SECURITY_ERR
    )
  );

  assert(
    RequestCredentials.includes(credentials),
    new TypeError(`${credentials} is not a valid value for credentials`)
  );
  assert(
    WorkerType.includes(type),
    new TypeError(`${type} is not a valid value for type`)
  );

  return [
    // Use absolute URL
    parsedURL.href,
    {
      // Convert name to string
      name: String(name),
      credentials,
      type
    }
  ];
}
