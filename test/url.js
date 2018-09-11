import test from './tools/test-wrapper.js';
import { testInBoth } from './utils.js';

test('url resolution', t => {

  t.test('full url', t => {
    // Should work from blob
    t.createWorker(t => {
      const w = new Worker(`${location.origin}/test/workers/worker1.js`);
      w.onmessage = ({ data }) => {
        t.ok(data, 'worker1');
        t.end();
      };
    });
  });

  t.test('relative url', t => {
    const w = new Worker('/test/workers/load-worker.js#worker1.js');
    w.onmessage = ({ data }) => {
      t.ok(data, 'worker1');
      t.end();
    };
  });

  t.test('absolute url', t => {
    const w = new Worker(
      '/test/workers/load-worker.js#/test/workers/worker1.js'
    );
    w.onmessage = ({ data }) => {
      t.ok(data, 'worker1');
      t.end();
    };
  });

  t.end();
});
