import test from 'ava'; // eslint-disable-line
import getArgs from '../src/getArgs.mjs';

test('getArgs', (t) => {
  t.deepEqual(getArgs(), {
    invalid: {
      $ne: true,
    },
  });
  t.deepEqual(getArgs({ name: 'aa' }), {
    invalid: {
      $ne: true,
    },
    name: 'aa',
  });
  t.deepEqual(getArgs({ name: null }), {
    invalid: {
      $ne: true,
    },
  });
  t.deepEqual(getArgs({
    timeCreateStart: 20,
  }), {
    invalid: {
      $ne: true,
    },
    timeCreate: {
      $gte: 20,
    },
  });
  t.deepEqual(getArgs({
    timeCreateEnd: 200,
  }), {
    invalid: {
      $ne: true,
    },
    timeCreate: {
      $lte: 200,
    },
  });
  t.deepEqual(getArgs({
    timeCreateStart: 20,
    timeCreateEnd: 200,
  }), {
    invalid: {
      $ne: true,
    },
    timeCreate: {
      $gte: 20,
      $lte: 200,
    },
  });
  t.deepEqual(getArgs({
    timeUpdateStart: 20,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeUpdate: {
      $gte: 20,
    },
  });
  t.deepEqual(getArgs({
    timeUpdateEnd: 200,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeUpdate: {
      $lte: 200,
    },
  });
  t.deepEqual(getArgs({
    timeUpdateStart: 20,
    timeUpdateEnd: 200,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeUpdate: {
      $gte: 20,
      $lte: 200,
    },
  });
  t.deepEqual(getArgs({
    timeCreateStart: 30,
    timeUpdateStart: 20,
    timeUpdateEnd: 200,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeCreateStart: 30,
    timeUpdate: {
      $gte: 20,
      $lte: 200,
    },
  });
});
