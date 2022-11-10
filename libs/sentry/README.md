# @haqq/sentry

## Usage

Just add following lines to your code:

```ts
const sentryDsn = 'PASTE_YOUR_SENTRY_DSN_HERE';

if (sentryDsn) {
  import('@haqq/sentry').then(({ initSentry }) => {
    initSentry(sentryDsn);
  });
}
```
