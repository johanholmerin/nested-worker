import zora from '../../node_modules/zora/dist/zora.es.js';

export default function testWrapper(name, func, test = zora) {
  const TIMEOUT = 5 * 1000;

  test(name, t => {
    return new Promise((res, rej) => {
      const id = generateId();
      const timeout = setTimeout(() => t.rej('timeout'), TIMEOUT);

      // Extend t
      t.createWorker = getCreateWorker(id);
      t.end = () => {
        clearTimeout(timeout);
        res();
      };
      t.rej = (...args) => {
        clearTimeout(timeout);
        rej(new Error(...args));
      };
      const subtest = t.test;
      t.test = (subname, subfunc) => testWrapper(subname, subfunc, subtest);

      // Add channel listener
      listen(id, t);

      // Run function
      const result = func(t);
      // Function can return a Promise
      if (result instanceof Promise) {
        result
          .then(() => t.end())
          .catch(error => rej(error));
      }
    });
  });
}
