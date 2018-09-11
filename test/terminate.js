import test from './tools/test-wrapper.js';
import { testInBoth } from './utils.js';

test('terminate', t => {

  t.test('from window', t => {
    const w = t.createWorker(t => {
      const w = t.createWorker(t => {
        const w = t.createWorker(t => {
          postMessage('awake');
          setTimeout(() => {
            t.rej('still awake');
          }, 100);
        });
        // Forward
        w.onmessage = ({ data }) => postMessage(data);
      });
      // Forward
      w.onmessage = ({ data }) => postMessage(data);
    });

    w.onmessage = ({ data }) => {
      t.ok(data, 'awake');
      w.terminate();

      setTimeout(() => {
        t.end();
      }, 200);
    };
  });

  t.test('from worker', t => {
    const w = t.createWorker(t => {
      const w = t.createWorker(t => {
        const w = t.createWorker(t => {
          postMessage('awake');
          setTimeout(() => {
            t.rej('still awake');
          }, 100);
        });
        // Forward
        w.onmessage = ({ data }) => postMessage(data);
      });

      w.onmessage = ({ data }) => {
        t.ok(data, 'awake');
        w.terminate();

        setTimeout(() => {
          t.end();
        }, 200);
      };
    });
  });

  t.end();
});

test('close', t => {

  t.test('from first worker', t => {
    t.createWorker(t => {
      const w = t.createWorker(t => {
        postMessage('awake');
        setTimeout(() => {
          t.rej('still awake');
        }, 100);
      });

      w.onmessage = ({ data }) => {
        t.ok(data, 'awake');
        close();
      };
    });

    setTimeout(() => {
      t.end();
    }, 200);
  });

  t.test('from nested worker', t => {
    t.createWorker(t => {
      const w = t.createWorker(t => {
        postMessage('awake');
        setTimeout(() => {
          setTimeout(() => {
            t.rej('still awake');
          }, 100);
          close();
        }, 100);
      });

      w.onmessage = ({ data }) => {
        t.ok(data, 'awake');

        setTimeout(() => {
          t.end();
        }, 200);
      };
    });
  });

  t.end();
});
