/* eslint-disable no-unused-vars  */

function createWorker(...strings) {
  return new Worker(URL.createObjectURL(new Blob(strings, {
    type: 'application/javascript'
  })));
}
