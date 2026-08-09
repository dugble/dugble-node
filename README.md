# Dugble Node SDK

Official Node.js and TypeScript SDK for the Dugble API.

## Installation

```bash
npm install @dugble/sdk
```

## Quick start

```ts
import { Dugble } from "@dugble/sdk";

const client = new Dugble({
  apiKey: process.env.DUGBLE_API_KEY ?? "",
});

console.log(client.baseUrl);
```

## Features

- Simple client initialization
- Strong TypeScript support
- Built for Node.js 20+

## Development

```bash
npm install
npm test
npm run build
```

## License

Apache-2.0
