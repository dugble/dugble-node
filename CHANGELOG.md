# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2026-08-10

### Added

- Official Node.js and TypeScript SDK client for the Dugble API.
- Email sending, batch sending, retrieval, listing, updates, cancellation, and delivery events.
- SMS sending, batch sending, retrieval, listing, updates, cancellation, delivery events, and status synchronization.
- Sending domain creation, listing, retrieval, verification, and deletion.
- SMS sender ID creation, listing, retrieval, and deletion.
- Contact creation, listing, retrieval, updates, deletion, topic subscriptions, and segment memberships.
- Contact property creation, listing, retrieval, updates, and deletion.
- Topic creation, listing, retrieval, updates, and deletion.
- Segment creation, listing, retrieval, contact listing, and deletion.
- Email suppression creation, listing, retrieval, deletion, and batch add/remove operations.
- Broadcast creation, listing, retrieval, updates, deletion, preview, sending, scheduling, cancellation, duplication, recipients, exclusions, and analytics.
- SMS campaign creation, listing, retrieval, updates, deletion, preview, sending, scheduling, cancellation, duplication, recipients, cost estimates, exclusions, and analytics.
- Email template creation, listing, retrieval, updates, deletion, publishing, duplication, preview, test sending, and version history with revert support.
- Automatic idempotency keys for email and SMS send operations, with support for caller-supplied stable keys.
- Custom API base URL and user agent configuration.
- Structured SDK responses with data, error details, response headers, status codes, and request IDs when available.
- ESM and CommonJS package entry points with TypeScript declarations.
- CI checks for formatting, linting, type checking, tests, builds, supported Node.js versions, and packed-package ESM/CommonJS imports.
- npm trusted publishing with tag/version validation and GitHub release creation after successful publication.

### Supported runtimes

- Node.js 20, 22, and 24.

## [0.1.2] - 2026-08-10

### Added

- Broadcasts, campaigns, templates, and contact properties.

## [0.1.1] - 2026-08-10

### Added

- Contacts, topics, segments, suppressions, domains, and sender IDs.

### Changed

- Restored strict API response envelopes for audience resources.

## [0.1.0] - 2026-08-10

### Added

- Initial TypeScript SDK foundation.
- API key validation and custom API base URL support.
- Email and SMS resources, including batch sends and email events.
- Automatic idempotency keys for email and SMS send operations.
- HTTP transport hardening.
- Build, lint, test, type-check, CI, and release configuration.
