# QA チェック定義

## コンテンツセクション対応表

| about-content.js | about.md の見出し | 期待される対応 |
|------------------|-------------------|----------------|
| `awards` | `## 受賞 / Award` | 完全一致 |
| `certifications` | `## 資格 / Certifications` | 完全一致 |
| `speaking` | `## 登壇 / Public Speaking` | 完全一致 |
| `organizedEvents` | `## 主催イベント / Organized Events` | 完全一致 |
| `research` | `## 論文 / Paper` | 完全一致 |
| `writing` | `## 執筆 / Writing` | 完全一致 |
| `media` | `## 掲載 / Interview` | **要注意**: セクション名不一致 |
| `podcasts` | `## Podcast` | 完全一致 |
| `workHistory` | `## 職歴 / Work History` | 完全一致 |
| `education` | `## 学歴 / Education` | 完全一致 |
| `links` | `## Links` | 完全一致 |

## 既知の問題

### 1. Media セクションの欠損

**about.md の掲載/Interview セクション (11件)**:
1. 日経クロスウーマン (2025/09)
2. 朝日新聞 (2025/06)
3. CyberAgent Way Tech DE&I (2025/03)
4. YOUTRUST プロダクトヒストリーカンファレンス (2025/01)
5. デジタルプラクティス論文発表 (2025/01)
6. Forbes JAPAN (2024/09)
7. Women Tech Terrace 2024 (2024/08)
8. Women Tech Terrace 2024 Report (2024/07)
9. Waffle & IT ジェンダーギャップ (2024/03)
10. SELECK (2023/08)
11. CodeZine (2023/01)

**about-content.js の media (6件)**:
1. 日経クロスウーマン
2. 朝日新聞
3. CyberAgent Tech DE&I
4. Forbes
5. SELECK
6. CodeZine

**欠損 (5件)**:
- YOUTRUST プロダクトヒストリーカンファレンス
- デジタルプラクティス論文発表
- Women Tech Terrace 2024 イベント情報
- Women Tech Terrace 2024 レポート
- Waffle & IT ジェンダーギャップ

### 2. セクション名の不一致

| 日本語 | 英語 | 問題点 |
|--------|------|--------|
| 掲載/Media | Media | 「掲載」と「Interview」の混在、冗長性 |

## バイリンガルコンテンツチェック

各アイテムは以下の構造を持つべき:

```javascript
{
  title: {
    ja: '日本語タイトル',  // 必須
    en: 'English Title'    // 必須
  },
  // ...
}
```

チェックルール:
- `title.ja` が存在すること
- `title.en` が存在すること
- どちらも空文字でないこと

## チェック実行ロジック

```javascript
function detectContentGaps() {
  const gaps = [];

  // about-content.js を読み込み
  const { media, speaking, writing } = require('./about-content.js');

  // about.md から該当セクションを抽出
  const mdContent = fs.readFileSync('./about.md', 'utf-8');

  // media セクションの比較
  const mediaInMd = extractSectionFromMd(mdContent, '掲載');

  for (const item of mediaInMd) {
    const found = media.some(m =>
      m.url === item.url ||
      m.title.ja.includes(item.title)
    );
    if (!found) {
      gaps.push({ section: 'media', item, type: 'missing' });
    }
  }

  return gaps;
}
```

## UI/UX チェック項目

### レスポンシブ

| デバイス | 解像度 | チェック内容 |
|----------|--------|--------------|
| Desktop | 1280x720 | レイアウト崩れ、要素の重なり |
| Mobile | 375x667 (iPhone 13) | ナビゲーション、タッチターゲット |
| Tablet | 768x1024 (iPad) | 中間レイアウト |

### コンソールエラー

- JavaScript エラー（TypeError, ReferenceError など）
- 404 リソースエラー
- CORS エラー
- React/Gatsby 警告

### パフォーマンス

- ページ読み込み完了
- 画像の遅延読み込み
- 初回レンダリング
