# Releasing Dugble Node SDK

This document describes the release process for `@dugble/sdk`.

## Release requirements

Before cutting a stable release:

1. Confirm the release branch is up to date with `main`.
2. Confirm the public SDK surface is intentionally stable for the release.
3. Run:

   ```bash
   npm ci
   npm run release:check
   ```

4. Confirm CI passes on Node.js 20, 22, and 24.
5. Confirm the packed package can be imported through both ESM and CommonJS. CI performs these smoke tests against the generated npm tarball.
6. Review `CHANGELOG.md` and make sure the release notes match the shipped API surface.
7. Update release-facing README language so it no longer describes the package as pre-1.0 or unpublished.
8. Update `package.json` and `package-lock.json` to the exact release version.

## Versioning

Stable releases follow semantic versioning.

After `1.0.0`:

- Patch releases contain backwards-compatible fixes.
- Minor releases contain backwards-compatible functionality.
- Major releases may contain backwards-incompatible public API changes.

Treat exported classes, exported TypeScript types, constructor options, resource methods, method arguments, response shapes, and documented runtime behavior as part of the public API unless explicitly documented otherwise.

## Release candidates

For release candidates, use prerelease versions such as:

```text
1.0.0-rc.1
1.0.0-rc.2
```

Use release candidates when validating packaging or API behavior before making the stable `1.0.0` compatibility commitment.

## Publishing

Publishing is handled by `.github/workflows/publish.yml` through npm trusted publishing.

The workflow requires:

- a tag named `v<package-version>`;
- the tagged commit to be on `main`;
- successful npm publication before the GitHub Release is created.

For `1.0.0`, after the release changes are merged to `main` and CI is green:

```bash
git checkout main
git pull --ff-only

git tag v1.0.0
git push origin v1.0.0
```

Do not move or reuse a published release tag. If publication fails after a package version has already been published, prepare a new patch or prerelease version instead.

## Post-release verification

After publication:

1. Confirm `@dugble/sdk` resolves to the intended version on npm.
2. Confirm the GitHub Release exists for the same tag.
3. Install the published package in a clean Node.js project.
4. Verify a basic ESM import and CommonJS require.
5. Verify one authenticated API request against the production Dugble API using non-destructive test data.
