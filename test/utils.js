export function testInBoth(t, func, msg = '') {
  const postfix = msg ? ` - ${msg}` : msg;

  t.test(`window${postfix}`, func);

  t.test(`nested${postfix}`, t => {
    t.createWorker(func);
  });
}
