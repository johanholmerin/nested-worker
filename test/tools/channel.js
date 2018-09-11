/* eslint-disable no-unused-vars  */

function _createChannel(id) {
  const CHANNEL_PREFIX = 'test_channel_';

  return new BroadcastChannel2(CHANNEL_PREFIX + id);
}

function listen(id, target) {
  _createChannel(id).onmessage = ({ name, args }) => {
    target[name](...args);
  };
}

function send(id, name, ...args) {
  _createChannel(id).postMessage({ name, args });
}
