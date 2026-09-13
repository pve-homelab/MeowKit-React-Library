# Changesets

Coordinated versioning for the public `@meowkit` packages:

- `@meowkit/design-tokens`
- `@meowkit/global-styles`
- `@meowkit/components`

`@meowkit/storybook` is private and ignored.

## Usage

```bash
npx pnpm@9.15.0 changeset
npx pnpm@9.15.0 version-packages
```

`changeset` records a bump for one or more public packages. `version-packages` applies pending changesets, bumps versions, and updates changelogs.
