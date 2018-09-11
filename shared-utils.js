/**
 * Forward MessageEvents from one MessagePort to another
 */
function forwardEvent(from, to, name) {
  from.addEventListener(name, event => {
    to.dispatchEvent(
      new MessageEvent(event.type, {
        data: event.data,
        origin: event.origin,
        lastEventId: event.lastEventId,
        ports: event.ports
      })
    );
  });
}

/**
 * Forward `message` and `messageerror` events between ports
 */
export function forwardEvents(from, to) {
  forwardEvent(from, to, 'message');
  forwardEvent(from, to, 'messageerror');

  // MessagePorts needs to explicitly started when using addEventListener
  from.start();
}

/**
 * Create a Worker Class that uses MessagePorts to send messages.
 * Calls `super` with remote port as first argument and sets `_port` to local
 * port.
 */
export function createWorkerClass(BaseClass) {
  return class Worker extends BaseClass {

    get [Symbol.toStringTag]() {
      return 'Worker';
    }

    constructor(...args) {
      const { port1, port2 } = new MessageChannel();
      super(port2, ...args);

      this._port = port1;
    }

    postMessage(...args) {
      this._port.postMessage(...args);
    }

    addEventListener(...args) {
      this._port.addEventListener(...args);
    }

    removeEventListener(...args) {
      this._port.removeEventListener(...args);
    }

    dispatchEvent(...args) {
      this._port.dispatchEvent(...args);
    }

    set onmessageerror(value) {
      this._port.onmessageerror = value;
    }

    get onmessageerror() {
      return this._port.onmessageerror;
    }

    set onmessage(value) {
      this._port.onmessage = value;
    }

    get onmessage() {
      return this._port.onmessage;
    }

  };
}

/**
 * Get a workers id
 */
export function findWorkerId(workers, worker) {
  return Object.keys(workers).find(id => workers[id] === worker);
}
