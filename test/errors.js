import test from './tools/test-wrapper.js';
import { testInBoth } from './utils.js';

test('errors', t => {

  testInBoth(t, t => {
    const w = t.createWorker(t => {
      throw new Error('error message');
    });
    w.onerror = event => {
      t.ok(event.message.includes('error message'));
      t.end();
    };
  }, 'emits onerror on uncaught error in worker');

  testInBoth(t, t => {
    // Workers used to throw, should now emit error event
    try {
      const w = new Worker('https://example.com');
      w.onerror = () => t.end();
    } catch (_) {
      t.end();
    }
  }, 'other origin');

  t.end();
});
