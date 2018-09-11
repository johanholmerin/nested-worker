import {
  forwardEvents,
  createWorkerClass,
  findWorkerId
} from './shared-utils.js';
import {
  connect,
  error as errorMessage,
  CONNECT,
  CREATE_WORKER,
  TERMINATE
} from './messages.js';

function getWorker(worker) {
  return worker._worker || worker;
}

function deepTerminate(worker) {
  Object.values(worker._workers).forEach(subworker => deepTerminate(subworker));
  getWorker(worker).terminate();
}

const OriginalWorker = self.Worker;
const commands = {
  [CONNECT](data, parentWorker, worker) {
    // Connect port to window worker
    if (worker === parentWorker) {
      forwardEvents(data.port, worker._port);
      return;
    }

    // Forward port to worker
    const id = findWorkerId(parentWorker._workers, worker);
    getWorker(parentWorker).postMessage(...connect({ port: data.port, id }));
  },
  [CREATE_WORKER](data, parentWorker, worker) {
    const subWorker = new OriginalWorker(...data.args);

    subWorker._workers = {};
    // Forward errors to subWorkers parent
    subWorker.onerror = event => {
      getWorker(worker).postMessage(...errorMessage({
        id: data.id,
        error: event
      }));
    };

    worker._workers[data.id] = subWorker;
    setupWorker(subWorker, worker, data.port);
  },
  [TERMINATE](data, parentWorker) {
    if (!parentWorker._workers[data.id]) return;

    deepTerminate(parentWorker._workers[data.id]);
    parentWorker._workers[data.id].onmessage = undefined;
    parentWorker._workers[data.id].onerror = undefined;
    parentWorker._workers[data.id] = undefined;
  }
};

/**
 * Send port to worker and listen for messages
 */
function setupWorker(worker, parentWorker, remotePort) {
  getWorker(worker).postMessage(...connect({ id: 0, port: remotePort }));
  getWorker(worker).onmessage = ({ data }) => {
    commands[data.type](data, parentWorker, worker);
  };
}

self.Worker = createWorkerClass(class {

  constructor(port, ...args) {
    this._worker = new OriginalWorker(...args);
    this._workers = {};

    setupWorker(this, this, port);
  }

  terminate() {
    deepTerminate(this);
  }

  set onerror(value) {
    this._worker.onerror = value;
  }

  get onerror() {
    return this._worker.onerror;
  }

});
