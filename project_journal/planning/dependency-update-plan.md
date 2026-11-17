# Dependency Update Plan

**Audit date:** 2026-11-17
**Baseline:** Node v20.16.0 · npm 10.8.3 · NestJS 11.2.3 · TypeORM 0.3.31
**`npm audit`:** 19 vulnerabilities (2 critical, 5 high, 12 moderate)

The plan is split into phases, ordered by urgency and risk. Phases 0–3 are low risk and should be done now.
Phases 4–5 are planned migrations and should each get their own branch.

---

## Phase 0 — Prepare

1. Commit or stash the current work on `IMP-JWT-AUTH` (the working tree already has a modified `package-lock.json`).
2. Create a dedicated branch from `IMP-JWT-AUTH`. That's the latest branch and the only one with the NestJS 11 upgrade; `master` is behind it.
   ```bash
   git checkout IMP-JWT-AUTH
   git pull
   git checkout -b chore/dependency-updates
   ```
3. Record the baseline so you can compare afterwards:
   ```bash
   npm outdated > outdated-before.txt
   npm audit > audit-before.txt
   ```
4. Confirm the project builds and the tests pass **before** changing anything:
   ```bash
   npm run build:auth && npm run build:church && npm run build:members && npm run build:gateway
   npm test
   ```

---

## Phase 1 — Security patches (urgent, no breaking changes)

These fixes stay inside the current major versions.

```bash
npm audit fix
npm update
```

**What this fixes:**

| Package | Severity | Via | Fixed by |
|---|---|---|---|
| `@nestjs/microservices` ≤11.2.4 | High | direct | Nest 11.2.10. Fixes the crash from deeply nested message patterns (GHSA-m8vh-jmq9-5rjg). |
| `body-parser` 2.0.0–2.3.0 | High | express 5 | Patched body-parser. Fixes a DoS through compressed request bodies (GHSA-27r3-jxmh-p828). |
| `proxy-addr` ≤2.0.7 | Critical | express 5 | Patched proxy-addr. Fixes IP spoofing when `trust proxy` is on. |
| `multer` ≤2.4.0 | High | platform-express | `@nestjs/platform-express` 11.2.10. |
| `handlebars` ≤4.7.9 | Critical | ts-jest (dev only) | Patched handlebars. |
| `brace-expansion`, `qs`, `fast-uri` | Mod/High | tooling | Patched versions. |

`npm update` also brings these packages up within their existing ranges: `pg`, `prettier`, `supertest`, `ts-jest`,
`@typescript-eslint/*`, `eslint-plugin-prettier`.

**Expected leftovers.** Accept these for now:
- `glob` / `minimatch` warnings through `@nestjs/cli@11`, `typeorm@0.3.x`, `nodemon` and `@typescript-eslint`.
  They only affect build and dev tooling. Fixing them needs Nest CLI 12 (Phase 5) or a future TypeORM 0.3 patch.
- **Do NOT run `npm audit fix --force`.** It would jump `@nestjs/cli` to v12 with nothing else upgraded alongside it.

**Verify:**
```bash
npm audit            # should only show the expected leftovers above
npm run build:auth && npm run build:church && npm run build:members && npm run build:gateway
npm test
```
Then start RabbitMQ and all four services, and smoke test login, cookie auth, and one church/members request through the gateway.

Commit:
```bash
git add package.json package-lock.json
git commit -m "chore(deps): apply security patches (npm audit fix + npm update)"
```

---

## Phase 2 — Small fixes and cleanup

### 2.1 Fix the Express type definitions
You run express 5, but `@types/express` is still on v4.
```bash
npm install -D @types/express@^5
```
Then rebuild. Fix any type errors in middleware or `Request`/`Response` usage, such as the cookie handling in auth.

### 2.2 Remove unused packages
`passport-local` and `@types/passport-local` aren't imported anywhere in `apps/`, `libs/` or `scripts/`.
```bash
# double-check first
grep -rn "passport-local" apps libs scripts
npm uninstall passport-local @types/passport-local
```

> **Keep** these even though the code rarely imports them directly, because they're needed at runtime:
> - `pg`: TypeORM's Postgres driver
> - `passport`: peer of `@nestjs/passport`
> - `amqplib`, `amqp-connection-manager`: peers of Nest's RMQ transport
> - `jsonwebtoken`: used for a type import in `apps/auth/src/auth.module.ts`

**Verify:** build all apps, run `npm test`, then commit.

---

## Phase 3 — Runtime platform (Node 20 is end-of-life)

Node 20 has been end-of-life since April 2026. Move to **Node 22 LTS** (the safest choice) or Node 24 LTS.

### 3.1 Local machine
Install Node 22 with nvm-windows or the installer, then:
```bash
node -v   # v22.x
rm -rf node_modules
npm ci
```

### 3.2 Pin the version in the repo
Add to `package.json`:
```json
"engines": {
  "node": "^22.13.0"
}
```
(`^22` rather than `>=22`, so Railway can't silently jump to a newer, non-LTS major.)
Optionally add a `.nvmrc` containing `22`.

### 3.3 Update the types
```bash
npm install -D @types/node@^22
```

### 3.4 Dockerfiles
In `apps/api-gateway/Dockerfile`, `apps/auth/Dockerfile`, `apps/church/Dockerfile` and `apps/members/Dockerfile`:
```dockerfile
FROM node:22-alpine
```
(Use `node:22` instead if you need the full Debian image.)

### 3.5 Railway
Set the Node version for each service to 22, either with the `engines` field or the `NIXPACKS_NODE_VERSION=22` variable.

### 3.6 Postgres (also end-of-life)
`docker-compose.yml` uses `postgres:13`, which has been end-of-life since November 2025.
- **Local:** change to `postgres:16` or `postgres:17`. The volumes are commented out, so local data is temporary anyway.
- **Production:** check which version Railway runs. Upgrading a production database needs a dump and restore, so plan that separately.

**Verify:** `npm ci`, build all apps, `npm test`, run `docker compose up`, and run the migrations on a fresh database:
```bash
npm run migration:run:auth
npm run migration:run:church
npm run migration:run:members
```
Then commit.

---

## Phase 4 — Tooling majors (medium effort, dev only)

Do each item as a separate commit so it's easy to revert.

### 4.1 ESLint 8 → 9 (ESLint 8 is end-of-life)
```bash
npm install -D eslint@^9 eslint-config-prettier@^10 @eslint/js typescript-eslint
```
- Convert `.eslintrc.js` to the new `eslint.config.mjs` format. The official tool can help:
  `npx @eslint/migrate-config .eslintrc.js`
- Delete `.eslintrc.js` once the new config works.
- Run `npm run lint` and fix anything new it reports.

### 4.2 Jest 29 → 30 (optional)
```bash
npm install -D jest@^30 @types/jest@^30 ts-jest@latest
```
Check that the installed `ts-jest` lists Jest 30 as a supported peer, then run `npm test`.

### 4.3 Small utility majors (optional)
```bash
npm install -D cross-env@^10
npm install dotenv@^18 class-validator@^0.15
```
- `dotenv` is used in three `orm-config.ts` files. Check that the migrations still read `.env` correctly.
- After the `class-validator` bump, retest the DTO validation (bad payloads should still return 400s).

---

## Phase 5 — Framework majors (plan as a separate project)

### 5.1 NestJS 11 → 12
Upgrade **all** `@nestjs/*` packages together on one branch:
```bash
npm install @nestjs/common@^12 @nestjs/core@^12 @nestjs/microservices@^12 \
  @nestjs/platform-express@^12 @nestjs/config@^12 @nestjs/jwt@^12 @nestjs/passport@^12
npm install -D @nestjs/cli@^12 @nestjs/testing@^12 @nestjs/schematics@latest
```
- First check that `@nestjs/cqrs`, `@nestjs/throttler` and `@nestjs/typeorm` have releases that support Nest 12.
- Read the official Nest 12 migration guide.
- Revisit `amqplib` (0.10 → 2.x) and `amqp-connection-manager` (4 → 5) here, and test the RMQ transport end to end:
  gateway → auth/church/members, CQRS sagas, and error propagation.
- Requires Node ≥20 (Phase 3 covers that).

### 5.2 TypeORM 0.3 → 1.x — **wait**
TypeORM 1.1.3 is out, but it's a breaking release, and you have migrations in three services.
- Stay on `typeorm@0.3.x` until `@nestjs/typeorm` officially supports 1.x.
- When you do upgrade, try it against copies of each database first, and run `migration:generate` to confirm no changes appear unexpectedly.

### 5.3 TypeScript 5.9 → 7.x — **wait**
TypeScript 7 is the new Go-based compiler. Hold off until the Nest CLI, ts-jest and ts-node support it.

---

## Checklist

- [x] Phase 0: branch `chore/dependency-updates` created from `IMP-JWT-AUTH` (`cb3bda9`). Baseline: all 4 apps build, 5/7 test suites pass.
  - [x] The 2 suites that were already failing (church/members controller specs had no `CommandBus` provider) are fixed with mocked buses and real assertions (commit `58c5bcc`). **11/11 tests now pass.**
- [x] Phase 1: `npm audit fix` + `npm update`, with version floors raised to `^11.2.10` (commit `441ba36`).
  - `npm audit`: 19 (2 critical, 5 high, 12 moderate) → **5 moderate** (only the expected `glob`/`minimatch` tooling leftovers)
- [x] Phase 2: `@types/express@5`, `passport-local` removed (commit `7e81d0e`). `tsc --noEmit` is clean.
- [x] Phase 3 (repo side): Dockerfiles on `node:22`, `engines` `^22.13.0`, `.nvmrc`, `@types/node@22`, compose on `postgres:17` (commit `dfc3b5e`)
  - [ ] Install Node 22 locally, then `rm -rf node_modules && npm ci` (until then npm shows an `EBADENGINE` warning)
  - [ ] Confirm Railway builds each service with Node 22
  - [ ] Check the Postgres version of the production databases on Railway
  - [ ] Full smoke test (below) with RabbitMQ and all four services running
- [x] Phase 4.1: ESLint 8 → 9, `.eslintrc.js` → `eslint.config.mjs` (commits `7811a49`, `e1e2e14`)
  - Lint results are identical before and after: the same 5,451 problems in 192 files, 5,375 of them `prettier/prettier` formatting.
  - **Watch out:** `npm run lint` has `--fix` built in. Running it will reformat ~190 files. Do that as its own
    "format only" commit on a quiet day, not mixed in with feature work.
- [ ] ~~Phase 4.2: Jest 30~~ tried and **reverted**. It brings in `glob` 10 and adds 16 moderate audit warnings (test tooling only)
  for no benefit. Try again when Jest ships a patched `glob`.
- [x] Phase 4.3: `dotenv` 18 (added `quiet: true` in the orm-configs), `class-validator` 0.15, `cross-env` 10 (commit `683d803`)
  - Runtime-checked: cross-env sets variables, dotenv loads `.env`, and class-validator still rejects bad UUIDs, emails and lengths.
  - [ ] Retest DTO validation through the gateway during the smoke test
- [ ] Phase 5: Nest 12 (planned), TypeORM 1.x (waiting), TypeScript 7 (waiting)

> Note: Node 22 goes end-of-life in April 2027. Plan the move to Node 24 LTS alongside Phase 5.

## Smoke test (run after every phase)

1. `docker compose up -d` (RabbitMQ + Postgres)
2. Start auth, church, members and the gateway
3. Register or log in, and confirm the JWT cookie is set
4. Call a protected gateway route, and confirm the request reaches the right microservice over RMQ
5. Create or read a church and a member record
6. Confirm rate limiting (throttler) still responds with 429 when you exceed the limit
