/* eslint-disable no-console */
import '../worker.js';

self.postMessage('nested to test');
self.onmessage = event => console.log('test to nested', event.data);
