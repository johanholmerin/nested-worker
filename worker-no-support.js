import {
  forwardEvents,
  createWorkerClass,
  findWorkerId
} from './shared-utils.js';
import {
  addPropertyListener,
  setupWorkerScope,
  generateId,
  parseWorkerArgs
} from './worker-utils.js';
import { terminate, createWorker, CONNECT, ERROR } from './messages.js';

const workers = {};
const commands = {
  [CONNECT]({ id, port }) {
    forwardEvents(port, workers[id]._port);
  },
  [ERROR]({ id, event }) {
    workers[id]._port.dispatchEvent(Object.assign(new Event('error'), event));
  }
};

function setupScope({ postMessage, addEventListener, close }) {
  const port = setupWorkerScope({ postMessage });

  // Add self to list of workers
  workers[0] = { _port: port };

  // Listen for messages from parent
  addEventListener('message', ({ data }) => {
    commands[data.type](data);
  });

  Object.assign(self, {
    close() {
      // Terminate subworkers
      Object.keys(workers).forEach(id => postMessage(...terminate({ id })));

      // Tell window to forget about self
      postMessage(...terminate({ id: 0 }));

      // Close self
      close();
    }
  });
}

function setupWorker({ postMessage }) {
  const BaseClass = createWorkerClass(class {

    constructor(port, ...args) {
      const parsedArgs = parseWorkerArgs(...args);
      const id = generateId();
      workers[id] = this;

      postMessage(...createWorker({ id, port, args: parsedArgs }));
    }

    terminate() {
      const id = findWorkerId(workers, this);
      workers[id] = undefined;

      postMessage(...terminate({ id }));
    }

    set onerror(value) {
      this._port.onerror = value;
    }

    get onerror() {
      return this._port.onerror;
    }

  });

  // `addPropertyListener` needs to run after `this._port` has been set,
  // hence the aditional class.
  self.Worker = class Worker extends BaseClass {

    constructor(...args) {
      super(...args);

      // Add `onerror` property listener
      addPropertyListener(this._port, 'error');
    }

  };
}

export default () => {
  setupWorker(self);
  setupScope(self);
};
