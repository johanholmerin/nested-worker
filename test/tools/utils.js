/* eslint-disable no-unused-vars  */

function getCreateWorker(id) {
  return func => createWorker(`
    importScripts(
      '${location.origin}/build/worker.js',
      '${location.origin}/build/bc.js',
      '${location.origin}/test/tools/channel.js',
      '${location.origin}/test/tools/utils.js',
      '${location.origin}/test/tools/create-worker.js',
      '${location.origin}/test/tools/tap-proxy.js'
    );

    (${func})(tapProxy(${JSON.stringify(id)}));
  `);
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
