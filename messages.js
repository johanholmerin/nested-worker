export const TERMINATE = 'TERMINATE';
export function terminate({ id }) {
  return [{ type: TERMINATE, id }];
}

export const CREATE_WORKER = 'CREATE_WORKER';
export function createWorker({ id, port, args }) {
  return [{ type: CREATE_WORKER, id, port, args }, [port]];
}

export const CONNECT = 'CONNECT';
export function connect({ id, port }) {
  return [{ type: CONNECT, id, port }, [port]];
}

export const ERROR = 'ERROR';
export function error({ id, error: errorOrEvent }) {
  return [{
    type: ERROR,
    id,
    // Events can not be structurally cloned.
    // Send properties and recreate at receiver instead.
    event: {
      message: errorOrEvent.message,
      lineno: errorOrEvent.lineno,
      colno: errorOrEvent.colno,
      filename: errorOrEvent.filename
    }
  }];
}
