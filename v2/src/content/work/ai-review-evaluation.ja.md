---
{
  "title": "AIに任せる範囲を、評価から考える。",
  "category": "Applied AI・評価設計",
  "summary": "一致率だけでなく、実際の業務判断に影響する誤りに着目したAIレビューの検証。",
  "role": "評価・ワークフロー設計",
  "organization": "Applied AIの実践",
  "timeframe": "2026年",
  "context": "AIのスコアは、業務上の意味を理解して初めて役立ちます。",
  "problem": "一致率が高くても、判断の境界をまたぐ誤りは隠れてしまいます。",
  "approach":
    [
      "入力・評価基準・プロンプト条件をそろえてモデルを比較する。",
      "カテゴリ別の誤りを検証し、最終判断は人に残す。",
    ],
  "outcome": "評価ロジックをスプレッドシート起点の業務フローで動かし、スコアと理由を確認できるようにしました。",
  "limitations": "レビュー工数50%削減は目標であり、達成実績ではありません。実際のレビュー時間は未計測です。",
  "translationKey": "ai-review-evaluation",
  "locale": "ja",
  "featured": true,
  "priority": 2,
  "visibility": "published",
  "seoDescription": "一致率だけでなく、実際の業務判断に影響する誤りに着目したAIレビューの検証。",
  "evidence":
    [
      {
        "title": "レビュー工数50%削減を目指す、LLMベンチマークとHuman-in-the-loop設計",
        "url": "https://zenn.dev/yukamiya/articles/reduce-review-cost-human-in-loop-ai",
      },
    ],
  "metrics":
    [
      {
        "value": "3",
        "label": "比較したモデルファミリー",
        "kind": "scope",
        "sourceUrl": "https://zenn.dev/yukamiya/articles/reduce-review-cost-human-in-loop-ai",
      },
    ],
}
---

## スコアだけでなく、判断を評価する

全体の一致率だけでは足りない。小さなスコアの差でも、判定の境界をまたげば、業務への影響は大きく変わります。

## 人とAIの境界を明確にする

システムが書き戻すのは、スコアとその理由まで。最終判定や通知は自動化していません。
