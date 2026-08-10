# Dugble Node SDK

Official Node.js and TypeScript SDK for the Dugble API.

> [!IMPORTANT]
> The Dugble Node SDK is currently unreleased and is not yet published for production use. The public API, types, and package surface may change before the first release.

## Requirements

- Node.js 20 or later
- A Dugble API key

## Installation

The SDK is not yet published to npm. Once released, it will be available as `@dugble/sdk`.

```bash
npm install @dugble/sdk
```

## Quick start

```ts
import { Dugble } from "@dugble/sdk";

const dugble = new Dugble("dug_test_example");
```

## Email

Send an email:

```ts
const { data, error } = await dugble.emails.send(
  {
    from: "Dugble <hello@example.com>",
    to: ["customer@example.com"],
    subject: "Hello from Dugble",
    html: "<strong>It works!</strong>",
  },
  {
    idempotencyKey: "email_request_123",
  },
);
```

Send a batch of emails:

```ts
const { data, error } = await dugble.emails.batch.send(
  [
    {
      from: "Dugble <hello@example.com>",
      to: ["one@example.com"],
      subject: "Hello one",
      text: "Hello from Dugble",
    },
    {
      from: "Dugble <hello@example.com>",
      to: ["two@example.com"],
      subject: "Hello two",
      text: "Hello from Dugble",
    },
  ],
  {
    idempotencyKey: "email_batch_123",
  },
);
```

The email resource currently exposes:

```ts
dugble.emails.send(...);
dugble.emails.get(...);
dugble.emails.list(...);
dugble.emails.update(...);
dugble.emails.cancel(...);
dugble.emails.batch.send(...);
```

## SMS

Send an SMS:

```ts
const { data, error } = await dugble.sms.send(
  {
    to: "+233555000000",
    from: "Dugble",
    body: "Hello from Dugble",
  },
  {
    idempotencyKey: "sms_request_123",
  },
);
```

Send a batch of SMS messages:

```ts
const { data, error } = await dugble.sms.batch.send(
  [
    {
      to: "+233555000001",
      from: "Dugble",
      body: "Hello one",
    },
    {
      to: "+233555000002",
      from: "Dugble",
      body: "Hello two",
    },
  ],
  {
    idempotencyKey: "sms_batch_123",
  },
);
```

The SMS resource currently exposes:

```ts
dugble.sms.send(...);
dugble.sms.get(...);
dugble.sms.list(...);
dugble.sms.update(...);
dugble.sms.cancel(...);
dugble.sms.events(...);
dugble.sms.syncStatus(...);
dugble.sms.batch.send(...);
```

## Development

```bash
npm install
npm run check
```

Individual development commands are also available:

```bash
npm run typecheck
npm test
npm run build
npm run ci
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE).

Copyright 2026 Dugble Limited.
