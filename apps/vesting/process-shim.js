/**
 * CJS process shim for readable-stream and deps (process-nextick-args).
 * Vite's process polyfill is ESM default export; require('process') expects
 * a plain object with nextTick. See: https://github.com/nodejs/readable-stream/issues/539
 */
const nextTick =
  typeof setImmediate !== 'undefined'
    ? setImmediate
    : (fn) => {
        return setTimeout(fn, 0);
      };

module.exports = {
  nextTick,
  version: 'v18.0.0',
  browser: true,
  env: {},
};
