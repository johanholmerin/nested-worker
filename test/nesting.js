import test from './tools/test-wrapper.js';

function createNesting(n) {
  const body = n ?
    `const w = createWorker(${JSON.stringify(createNesting(n - 1))});
    w.onmessage = ({ data }) => postMessage(data + '${n}');` :
    `postMessage('${n}');`;

  return `
    ${createWorker}
    importScripts('${location.origin}/build/worker.js');
    ${body}
  `;
}

test('nesting', t => {
  const w = createWorker(createNesting(3));
  w.onmessage = ({ data }) => {
    t.equal(data, '0123', 'should pass through all workers');
    t.end();
  };
});
