# Nested Worker Polyfill

Nested Worker polyfill for Safari. Uses MessageChannel to avoid
having to send all messages through the main thread. Does not support Shared
Workers.

## Install

```sh
yarn add git+https://github.com/johanholmerin/nested-worker#semver:^1.0.0
```

## Usage

Import the polyfill in the main thread before creating any worker, and as the
first statement in all workers.

```javascript
// in window
import 'nested-worker/window.js';

const worker = new Worker('worker.js', {
  type: 'module' // or transpile modules
});
```

```javascript
// worker.js
import 'nested-worker/worker.js';

const nestedWorker = new Worker('another-worker.js', {
  type: 'module' // or transpile modules
});
```

```javascript
// another-worker.js
import 'nested-worker/worker.js';
```
