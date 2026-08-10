# Dugble Node SDK

Official Node.js and TypeScript SDK for the Dugble API.

> [!IMPORTANT]
> Dugble Node SDK is under active development. APIs may evolve between minor releases while the package is pre-1.0.

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

const dugble = new Dugble("dgb_team_your_api_key");
```

## Email

Send an email:

```ts
const { data, error } = await dugble.emails.send({
  from: "Dugble <hello@example.com>",
  to: ["customer@example.com"],
  subject: "Hello from Dugble",
  html: "<strong>It works!</strong>",
});
```

Send a batch of emails:

```ts
const { data, error } = await dugble.emails.batch.send([
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
]);
```

List delivery events for an email:

```ts
const { data, error } = await dugble.emails.events("email_123", {
  limit: 20,
});
```

The email resource currently exposes:

```ts
dugble.emails.send(...);
dugble.emails.get(...);
dugble.emails.list(...);
dugble.emails.events(...);
dugble.emails.update(...);
dugble.emails.cancel(...);
dugble.emails.batch.send(...);
```

## SMS

Send an SMS:

```ts
const { data, error } = await dugble.sms.send({
  to: "+233555000000",
  from: "Dugble",
  body: "Hello from Dugble",
});
```

Send a batch of SMS messages:

```ts
const { data, error } = await dugble.sms.batch.send([
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
]);
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

## Domains

Create a sending domain:

```ts
const { data, error } = await dugble.domains.create({
  name: "example.com",
  region: "us-east-1",
});
```

The domains resource exposes:

```ts
dugble.domains.create(...);
dugble.domains.list(...);
dugble.domains.get(...);
dugble.domains.verify(...);
dugble.domains.delete(...);
```

Domain creation can return either a domain resource or a provisioning response when Dugble is still preparing the email infrastructure for the team.

## Sender IDs

Create an SMS sender ID:

```ts
const { data, error } = await dugble.senderIds.create({
  name: "Dugble",
  countryCode: "GH",
  purpose: "Transactional notifications",
});
```

The sender IDs resource exposes:

```ts
dugble.senderIds.create(...);
dugble.senderIds.list(...);
dugble.senderIds.get(...);
dugble.senderIds.delete(...);
```

## Contacts

Create a contact:

```ts
const { data, error } = await dugble.contacts.create({
  email: "ada@example.com",
  firstName: "Ada",
  properties: { plan: "pro" },
});
```

Contact topics and segment memberships are available as nested resources:

```ts
dugble.contacts.create(...);
dugble.contacts.list(...);
dugble.contacts.get(...);
dugble.contacts.update(...);
dugble.contacts.delete(...);

dugble.contacts.topics.list(...);
dugble.contacts.topics.update(...);
dugble.contacts.segments.list(...);
dugble.contacts.segments.add(...);
dugble.contacts.segments.remove(...);
```

## Topics

Topics represent subscription categories for contacts.

```ts
dugble.topics.create(...);
dugble.topics.list(...);
dugble.topics.get(...);
dugble.topics.update(...);
dugble.topics.delete(...);
```

Topic lists use cursor pagination with `after` and `before`.

## Segments

Segments group contacts into reusable audiences.

```ts
dugble.segments.create(...);
dugble.segments.list(...);
dugble.segments.get(...);
dugble.segments.contacts(...);
dugble.segments.delete(...);
```

## Suppressions

Create a manual email suppression:

```ts
const { data, error } = await dugble.suppressions.create({
  email: "recipient@example.com",
});
```

The suppressions resource exposes:

```ts
dugble.suppressions.create(...);
dugble.suppressions.list(...);
dugble.suppressions.get(...);
dugble.suppressions.delete(...);
dugble.suppressions.batch.add(...);
dugble.suppressions.batch.remove(...);
```

Suppression lists use cursor pagination and can be filtered by `bounce`, `complaint`, or `manual` origin. Batch add and remove operations accept up to 100 items.

## Idempotency

Dugble automatically generates an idempotency key for email and SMS send operations, including batch sends.

If you need to retry the same business operation across separate SDK calls, provide your own stable key:

```ts
await dugble.emails.send(
  {
    to: "customer@example.com",
    subject: "Order received",
    text: "We received your order.",
  },
  {
    idempotencyKey: "order_123_confirmation_email",
  },
);
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
