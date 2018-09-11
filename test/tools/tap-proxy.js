/* eslint-disable no-unused-vars  */

function tapProxy(id) {
  const METHODS = [
    // Supported zora methods
    'ok',
    'notOK',
    'deepEqual',
    'notDeepEqual',
    'fail',

    // Custom methods
    'rej',
    'end'
  ];

  const t = {
    createWorker: getCreateWorker(id),
    // Must be tested in this realm
    equal: (a, b, msg = 'should be equal') => send(id, 'ok', a === b, msg),
    notEqual: (a, b, msg = 'should not be equal') => {
      send(id, 'ok', a !== b, msg);
    }
  };

  METHODS.forEach(key => {
    t[key] = (...args) => send(id, key, ...args);
  });

  return t;
}
