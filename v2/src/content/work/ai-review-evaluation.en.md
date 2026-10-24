---
{
  "title": "Knowing where AI needs human judgment.",
  "category": "Applied AI & evaluation",
  "summary": "Benchmarking AI-assisted review, with attention to the errors that matter in an actual workflow.",
  "role": "Evaluation and workflow design",
  "organization": "Applied AI practice",
  "timeframe": "2026",
  "context": "An AI score is useful only when its operational consequences are understood.",
  "problem": "High agreement can conceal errors that cross a decision threshold.",
  "approach":
    [
      "Compare models under consistent inputs, rubrics, and prompt conditions.",
      "Examine category-level errors and keep final decisions with people.",
    ],
  "outcome": "The evaluation logic runs in a spreadsheet-based workflow, producing scores and reasons for review.",
  "limitations": "A 50% reduction in review effort is a target, not an achieved result. Actual review time has not yet been measured.",
  "translationKey": "ai-review-evaluation",
  "locale": "en",
  "featured": true,
  "priority": 2,
  "visibility": "published",
  "seoDescription": "Benchmarking AI-assisted review, with attention to the errors that matter in an actual workflow.",
  "evidence":
    [
      {
        "title": "LLM benchmarking and human-in-the-loop design",
        "url": "https://zenn.dev/yukamiya/articles/reduce-review-cost-human-in-loop-ai",
      },
    ],
  "metrics":
    [
      {
        "value": "3",
        "label": "model families compared",
        "kind": "scope",
        "sourceUrl": "https://zenn.dev/yukamiya/articles/reduce-review-cost-human-in-loop-ai",
      },
    ],
}
---

## Evaluate the decision, not just the score

The benchmark exposed why aggregate agreement is insufficient. A small scoring error can have a large consequence when it changes which side of a threshold an item falls on.

## Keep the boundary explicit

The system writes a score and rationale. It does not automatically write the final decision or send a notification.
