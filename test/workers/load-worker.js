importScripts('/build/worker.js');

const w = new Worker(location.hash.slice(1));
w.onmessage = ({ data }) => postMessage(data);
