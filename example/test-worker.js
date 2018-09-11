/* eslint-disable no-console */
import '../worker.js';

const w = new Worker('./nested-worker.js', { type: 'module' });
w.postMessage('test to nested');
w.onmessage = event => console.log('nested to test', event.data);

self.postMessage('test to main');
self.onmessage = event => console.log('main to test', event.data);
