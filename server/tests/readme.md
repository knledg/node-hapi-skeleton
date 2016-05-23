# Ava sample usage

[Ava API docs](https://github.com/avajs/ava)

```javascript
import test from 'ava';

test('foo', t => {
  t.pass();
});

test('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});

test.cb(t => {
  t.plan(1);

  someAsyncFunction(() => {
      t.pass();
      t.end();
  });
});

// won't run, no title
test(function (t) {
  t.fail();
});

test.skip('will not be run', t => {
  t.fail();
});

// using .failing if you expect the test to fail
test.failing('demonstrate some bug', t => {
  t.fail(); // test will count as passed
});

test(async function (t) {
  const value = await promiseFn();
  t.true(value);
});

// async arrow function
test(async t => {
  const value = await promiseFn();
  t.true(value);
});

// only this test will run if any tests have .only
test.only('will not be run', t => {
    t.fail();
});

```

