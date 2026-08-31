# Auto detect my public activities

State for the weekly automation that watches for new public activities by Yu Kamiya (神谷優 / `fuzzy31u` / `yukamiya`) and for QA problems on this site, then opens issues and PRs to keep `src/data/about-content.js` current.

## Files

| File | Role |
| --- | --- |
| `state.json` | Machine-readable authority. Search coverage (`sources`), tracked items (`activities`), verified non-matches (`rejected_candidates`), and last-run status (`runs`). |
| `memory.md` | Durable judgment calls and known traps that are not derivable from the data. Keep it concise. |

## Why the state lives here

The automation runs as a **cloud routine**, which gets a fresh checkout of this repository and nothing else — it cannot reach the owner's laptop. State was previously kept at `~/.codex/automations/auto-detect-my-public-activities/` and was migrated here on 2026-08-13 so it survives between runs. **Every run must commit its updates to these files.**

## Contract

`activities` is keyed by canonical URL (or a normalized fallback key), and each entry carries `content_type`, `title`, `canonical_url`, `detected_at`, `status`, `issue_number`, `pr_number`, `last_review_status`, `merged_at`, and `blocker`.

Valid `status` values: `detected`, `issue_opened`, `implemented`, `pr_opened`, `review_passed`, `merged`, `blocked`.

Only stamp `sources[query].last_checked_at` for queries that **actually ran**. If a sweep is cut short, record the blocker and leave the unrun queries stale — a falsely stamped timestamp is worse than a missing one, because it silently hides a coverage gap.

### `runs.pr_gate` is transient

When a run's PR cannot be merged because a review gate has not cleared, the run records the gate state under `runs.pr_gate` so the next run can resume instead of re-deriving it. That object is **scratch space, not history**: it holds a PR number, commit SHAs and workflow run IDs, and the run that resolves the PR must delete it. Durable history of what shipped belongs in `activities[].pr_number` / `merged_at`. Without this rule the file would accumulate one stale CI-metadata object per blocked PR.

### Recurring findings

One canonical URL gets **one** `activities` entry. When a finding recurs — most often a `QA Post Deploy` link report that does not reproduce — append to that entry's `recurrences` array rather than minting a new key. `QA Post Deploy` re-reports the same handful of Japanese hosts indefinitely, so keying per occurrence would grow this file without bound and break the "one key per canonical URL" dedup guarantee.

## Network access the routine needs

The routine inherits its cloud environment's network policy on every run. The **Default** environment uses **Trusted** access, which allows only Anthropic's default package-registry allowlist — so every host below is refused with `403` and `x-deny-reason: host_not_allowed`, and the sweep degrades to search-summary evidence it is not allowed to promote on. See the *Cloud environment constraints* section of `memory.md`.

Set the environment's **Network access** to **Custom**, check *Also include default list of common package managers*, and paste this list into **Allowed domains**:

```text
developers.cyberagent.co.jp
*.cyberagent.co.jp
zenn.dev
woman.nikkei.com
*.sbbit.jp
event.shoeisha.jp
findy-code.io
forbesjapan.com
codezine.jp
techbookfest.org
peatix.com
connpass.com
speakerdeck.com
youtrust.jp
fukabori.fm
yukamiya.me
```

Derived from the hosts in `state.json` `sources` and from the canonical URLs already tracked in `activities`. GitHub traffic goes through its own proxy and does not need an entry. Add a host here whenever a new source is added to `sources`, otherwise the next run silently loses that source.
