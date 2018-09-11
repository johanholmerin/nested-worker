import test from './tools/test-wrapper.js';
import { testInBoth } from './utils.js';

test('instance', t => {
  testInBoth(t, t => {
    const w = t.createWorker(() => {});

    t.ok(w instanceof Worker);
    t.deepEqual(w.toString(), '[object Worker]');

    t.deepEqual(typeof w.postMessage, 'function');
    t.deepEqual(typeof w.terminate, 'function');

    t.deepEqual(typeof w.addEventListener, 'function');
    t.deepEqual(typeof w.removeEventListener, 'function');
    t.deepEqual(typeof w.dispatchEvent, 'function');

    t.end();
  });
  t.end();
})

test('scope', t => {
  testInBoth(t, t => {
    t.deepEqual(typeof self.postMessage, 'function');
    t.deepEqual(typeof self.addEventListener, 'function');
    t.deepEqual(typeof self.removeEventListener, 'function');
    t.deepEqual(typeof self.close, 'function');

    t.end();
  });
  t.end();
})
