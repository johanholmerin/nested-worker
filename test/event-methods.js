import test from './tools/test-wrapper.js';
import { testInBoth } from './utils.js';

test('event methods', t => {

  testInBoth(t, t => {
    const w = t.createWorker(t => {
      postMessage('message string');
    });
    w.addEventListener('message', ({ data }) => {
      t.deepEqual('message string', data);
      t.end();
    });
  }, 'worker to parent addEventListener');

  testInBoth(t, t => {
    const w = t.createWorker(t => {
      postMessage('another message string');
    });
    w.onmessage = ({ data }) => {
      t.deepEqual('another message string', data);
      t.end();
    };
  }, 'worker to parent onmessage');

  testInBoth(t, t => {
    const w = t.createWorker(t => {
      self.addEventListener('message', ({ data }) => {
        t.deepEqual('message string', data);
        t.end();
      });
    });
    w.postMessage('message string');
  }, 'parent to worker addEventListener');

  testInBoth(t, t => {
    const w = t.createWorker(t => {
      self.onmessage = ({ data }) => {
        t.deepEqual('another message string', data);
        t.end();
      };
    });
    w.postMessage('another message string');
  }, 'parent to worker onmessage');

  testInBoth(t, t => {
    function onMessage() {
      t.rej('Should not be called');
    }
    const w = t.createWorker(t => {
      postMessage('another message string');
    });
    w.addEventListener('message', onMessage);
    w.removeEventListener('message', onMessage);
    setTimeout(() => t.end(), 200);
  }, 'removeEventListener');

  testInBoth(t, t => {
    const detail = {};
    const w = t.createWorker(t => {});
    w.addEventListener('custom-event', event => {
      t.equal(event.detail, detail);
      t.end();
    });
    w.dispatchEvent(Object.assign(new Event('custom-event'), { detail }));
  }, 'dispatchEvent');

  testInBoth(t, t => {
    function callback() {
    }
    const w = t.createWorker(t => {});
    w.onmessage = callback;
    t.equal(callback, w.onmessage);
    t.end();
  }, 'onmessage returns handler');

  testInBoth(t, t => {
    function callback() {
    }
    const w = t.createWorker(t => {});
    w.onerrormessage = callback;
    t.equal(callback, w.onerrormessage);
    t.end();
  }, 'onerrormessage returns handler');

  testInBoth(t, t => {
    function callback() {
    }
    const w = t.createWorker(t => {});
    w.onerror = callback;
    t.equal(callback, w.onerror);
    t.end();
  }, 'onerror returns handler');

  t.end();
});
