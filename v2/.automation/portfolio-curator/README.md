# Portfolio curator v2 — shadow operation

This implementation is isolated under `v2/`. It does not replace or edit the existing weekly cloud routine, its state, or the production site. Policy is explicitly `shadow`; there is no new schedule or live deployment integration.

## Current capability

Two author adapters discover public articles: the CyberAgent developer author page and Zenn's public author API. Each article is separately fetched and verified. Zenn identity comes from the sibling `pageProps.user.username`, bound to the article path and published status; the article's own object does not contain the author. CyberAgent requires the exact author metadata `yukamiya`. A mention of Yu in another author's report is not accepted as authorship.

This is the first automated source slice, not complete speaking/media discovery. Other sources require explicit adapters, hostname approval, and role-specific evidence before they can be automated. Do not use the writing adapter to classify talks or interviews.

Discovery returns candidates, not finished copy. English translations, summaries, and five relevance dimensions are editorial proposals. No model or external page can set approval. Source verification is a gate before scoring: 8–10 proposes a draft; 5–7 holds; 0–4 declines. Maximum three proposals per command. Homepage selection is separate and remains in the profile.

## Run from v2 with Node 24

```sh
npm run curator:validate
npm run curator:sweep
npm run curator:propose -- docs/curator/editorial-proposals.json
npm run validate
```

The example proposal is a real, source-verified article draft, not dummy content. It explicitly describes the 50% reduction as a target. Re-running it is idempotent if the source facts and draft are unchanged. Edited drafts require manual reconciliation. Published records are never overwritten.

Rescoring a proposed item to hold or decline updates its candidate and hidden draft together when the editorial copy has not been edited. The draft remains hidden and carries the new score. If a human has edited the draft, the command refuses the rescore before writing either record; reconcile those edits in the PR first.

If a verified article's source title, date, or canonical URL changes before a draft exists, refresh its evidence explicitly, then submit a corrected editorial proposal:

```sh
node scripts/curator/run.mjs reverify <candidate-id>
```

This rechecks the source. Without an existing draft, it resets the candidate to `verified` and clears its old editorial proposal. If a hidden draft exists and the source facts changed, it keeps that draft untouched, holds the candidate with `source-facts-changed; human-reconcile`, and records the newly verified facts. The old draft remains excluded from the site; a human must reconcile its title, translation, date, URL and summary in a maintenance PR before another proposal can proceed. Published content is never overwritten and requires a separate editorial correction PR.

Only to requeue a blocked candidate after diagnosing its blocker:

```sh
node scripts/curator/run.mjs retry <candidate-id>
```

Do not routinely bypass backoff. The live verification performed during implementation exposed and corrected a Zenn adapter mismatch; affected records were explicitly requeued after the regression test was added.

## State and migration

- `policy.json`: protected configuration, exact hostname list, budgets and adapters; never writable by the routine.
- `sources.json`: last actual attempt, successful discovery, and successful article verification. A blocked/unrun source never gains a success timestamp. `partial` means only one enumeration page was checked; this version does not claim complete paginated coverage.
- `candidates/{id}.json`: stage, identity evidence, aliases, relevance proposal, blocker, bounded attempts and retry time. Maximum 250; overflow is reported and processing stops adding records. Maintenance must reconcile/archive terminal candidates before raising or reaching the cap. No silent deletion or unbounded recurrence arrays.
- `decisions/{year}/{id}.json`: migrated merged and rejected records, kept for deduplication. Legacy merged records are historical evidence, not freshly verified v2 claims.
- `incidents/{id}.json`: QA findings separate from public activities, recurrence total and latest five details. Full history remains in the unchanged legacy file and Git history.
- `migration.json`: original snapshot hash, all 112 original source timestamps, and 25 mapped activity/rejection records. These are historical timestamps, not checks performed by the new adapters. Reconcile subsequent legacy automation changes before cutover.

The migration command refuses to overwrite an existing migration. It preserved 21 activity/QA entries plus four rejected candidates. Five previously parked Zenn articles became candidates requiring new verification; they were not automatically published.

Writes use same-directory temporary files and atomic rename. A lock prevents concurrent mutation. On an interrupted process, first establish that the PID in `.lock` is no longer running before removing that stale lock. Draft files are written before candidate status, so an interrupted proposal can safely resume. No evidence depends only on a transient run log.

URL normalization strips fragments and known tracking parameters, preserves meaningful query parameters, and records canonical aliases. Occurrence keys distinguish reused URLs across events. The writing adapters use `artifact`; a future event adapter must supply a real occurrence key. Ambiguous canonical collisions are held for reconciliation. Unknown dates are never guessed; invalid calendar dates fail validation.

## Fetch boundary

Only approved public HTTPS hosts, no URL credentials or custom ports. Every redirect is rechecked. All DNS answers must be public; one validated address is pinned to the connection, with TLS hostname verification retained. Requests carry no cookies, authorization, repository data, or environment values. Limits cover DNS/request time, redirects, response bytes, total requests, and media types. The response is parsed as inert HTML/JSON; no scripts, instructions, links, forms or downloads are executed.

Metadata verification confirms author/title/date/canonical facts, not the truth of every substantive claim. A human reviews summaries, relevance and impact claims against the original article. The source SHA identifies the fetched page; dynamic HTML can change its hash without changing article facts.

## Draft PR publishing

`publish.mjs` is deliberately separate from discovery and requires `--execute`. It has not been exercised against GitHub in this implementation. After the implementation is reviewed and available on the chosen base, start a dedicated `automation/portfolio-curator-*` branch from that up-to-date remote base. Run the curator there. From repository root:

```sh
node v2/scripts/curator/publish.mjs --base main --execute
```

The publisher checks the exact repository, branch prefix, remote base ancestry and every changed path in committed history, the worktree, the Git index, and untracked files before staging. It rechecks the index before committing. It runs validation, commits only permitted candidate/state/content paths, performs a normal push, and opens/reuses a draft PR. It cannot change UI, schemas, policy, workflows, deployment settings, legacy content, or published activities through its normal proposal command. It never merges or force-pushes. New content remains `draft`/`hold` and is absent from generated activity lists.

The path-check workflow provides another review check. Before activating the scheduler, protect the base and workflow/policy files, require this check and deterministic validation, require latest-head human approval with stale approvals dismissed, and retain Greptile 5/5 and Claude pass gates. These repository settings have not been changed or verified here. A JSON `approved: true` field is rejected, not interpreted as authorization. Do not grant the routine production secrets or permission to bypass branch protection.

Human publication is a reviewable change from draft/hold to published/selected, followed by checks and human merge. Main remains the publication boundary. A draft PR may be merged solely to retain a hidden draft; it does not by itself publish that draft. Existing weekly schedule remains unchanged until an explicit operational switch.

Use one active PR branch to persist checkpoints, including source coverage when appropriate, instead of a new issue for each empty sweep. No dedicated automation-state branch was created: its permissions/deployment isolation still need operational review. State-only PRs remain the conservative fallback.
