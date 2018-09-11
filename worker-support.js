import { forwardEvents, createWorkerClass } from './shared-utils.js';
import { setupWorkerScope } from './worker-utils.js';
import { connect } from './messages.js';

function setupScope({ postMessage, addEventListener }) {
  const port = setupWorkerScope({ postMessage });

  // Wait for remote port from parent
  addEventListener('message', ({ data }) => {
    forwardEvents(data.port, port);
  }, { once: true });
}

function setupWorker() {
  self.Worker = createWorkerClass(class extends self.Worker {

    constructor(port, ...args) {
      super(...args);

      // Send remote port to worker
      super.postMessage(...connect({ port }));
      // Wait for remote port from worker
      super.addEventListener('message', ({ data }) => {
        forwardEvents(data.port, this._port);
      }, { once: true });
    }

  });
}

export default () => {
  setupScope(self);
  setupWorker();
};
