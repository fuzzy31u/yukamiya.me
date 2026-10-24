import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const ledger = JSON.parse(
  await readFile(new URL("docs/content-ledger.json", root), "utf8"),
);
const profile = {
  name: { en: "Yu Kamiya", ja: "神谷 優" },
  headline: {
    en: "Advancing AI adoption across engineering organizations.",
    ja: "AIを、開発組織の実践へ。",
  },
  intro: {
    en: "I connect applied AI, technical leadership, and organizational change—helping teams rethink how they build, evaluate, and deliver.",
    ja: "AIの実装と評価、そして組織の変革。技術と人の両面から、チームのつくり方・働き方を考えています。",
  },
  role: {
    en: "Manager, AI Driven Office · Tech DE&I Lead at CyberAgent",
    ja: "サイバーエージェント AIドリブン推進室 マネージャー / Tech DE&I Lead",
  },
  biography: {
    en: [
      "My work sits between engineering practice and organizational change. At CyberAgent, I work on AI adoption and lead Tech DE&I, drawing on a career in product development, project management, and developer relations.",
      "Earlier work includes data management at AWA, project management at QUREO, and co-founding Ms.Engineer. These experiences shape how I think about technology: the quality of a system depends on the people and practices around it.",
      "I also speak, write, and co-host momit.fm. As a mother of three, I care about making a technical career sustainable—and creating more ways for people to take part.",
    ],
    ja: [
      "技術の実践と組織の変革、その間にある仕事に取り組んでいます。サイバーエージェントでAI活用を推進し、Tech DE&Iをリード。プロダクト開発、プロジェクトマネジメント、DevRelでの経験をつなげています。",
      "AWAでのデータマネジメント、QUREOでのプロジェクトマネジメント、Ms.Engineerの共同創設などを経験してきました。システムの良さは、それを支える人や仕組みと切り離せないと考えています。",
      "登壇・執筆に加え、momit.fmでポッドキャストを配信しています。3児の母として、技術と関わり続けられる働き方や、多様な人が参加できる環境づくりも大切にしています。",
    ],
  },
  philosophyBody: {
    en: "Technical change lasts when people can take part in it. My work in AI adoption, developer relations, and Tech DE&I is connected by that belief.",
    ja: "技術による変化を続けていくには、人が参加できることが大切です。AI活用推進、DevRel、Tech DE&I。これらの仕事は、その考えでつながっています。",
  },
  philosophy: {
    en: "Better systems. More people able to contribute.",
    ja: "より良い仕組みを。より多くの人が活躍できる環境を。",
  },
  career: ledger.profileSource.workHistory.map((x) => ({
    period: { ja: x.period, en: x.periodEn },
    title: x.title,
    company: x.company,
  })),
  education: ledger.profileSource.education,
  links: [
    { label: "GitHub", url: "https://github.com/fuzzy31u" },
    { label: "Zenn", url: "https://zenn.dev/yukamiya" },
    { label: "Speaker Deck", url: "https://speakerdeck.com/fuzzy31u" },
    { label: "X", url: "https://twitter.com/_yukamiya" },
  ],
  featuredWork: [
    "engineering-ai-adoption",
    "ai-review-evaluation",
    "qureo-translation",
  ],
  featuredActivities: [],
};
const selections = [
  [
    "https://2026.droidkaigi.jp/timetable/1304891/",
    {
      en: "Why organizational change needs more than individual enthusiasm.",
      ja: "変革を、一部の人の熱量で終わらせないために。",
    },
  ],
  [
    "https://developers.cyberagent.co.jp/blog/archives/63720/",
    {
      en: "Designing an assessment of AI adoption across development organizations.",
      ja: "開発組織のAI活用を可視化する、評価設計と運営。",
    },
  ],
  [
    "https://event.shoeisha.jp/devsumi/20250627/session/5829",
    {
      en: "AI agents and the possibility of a more inclusive future.",
      ja: "AIエージェントと、誰もが活躍できる未来。",
    },
  ],
];
for (const [url, summary] of selections) {
  const m = ledger.mappings.find((x) => x.original.url === url);
  if (!m) throw new Error(url);
  const file = new URL(`src/content/activities/${m.id}.json`, root);
  const item = JSON.parse(await readFile(file, "utf8"));
  item.editorialStatus = "selected";
  item.publicationStatus = "published";
  item.summary = summary;
  item.originalLanguage = "ja";
  await writeFile(file, JSON.stringify(item, null, 2) + "\n");
  profile.featuredActivities.push(m.id);
  m.disposition = "selected; retained in archive";
}
await writeFile(
  new URL("src/content/profile/yu.json", root),
  JSON.stringify(profile, null, 2) + "\n",
);
await writeFile(
  new URL("docs/content-ledger.json", root),
  JSON.stringify(ledger, null, 2) + "\n",
);
const original = await readFile(
  new URL("../../src/content/posts/20210128.md", import.meta.url),
  "utf8",
);
const body = original
  .split("---")
  .slice(2)
  .join("---")
  .replace(
    '<img src="/assets/blog_20210128_book.png" height="240">',
    '<img src="/assets/blog_20210128_book.png" height="240" alt="EdTech エドテック テクノロジーで教育が変わり、人類は進化する 書影">',
  );
await writeFile(
  new URL("src/content/writing/bookreview-edtech.md", root),
  '---\ntitle: "Book Review『EdTech エドテック テクノロジーで教育が変わり、人類は「進化」する』"\ndescription: "プログラミング教育の仕事を始めるにあたって考えた、EdTechと教育のこれから。"\nlocale: ja\ndate: "2021-01-28"\nlegacyPath: /bookreview-edtech/\n---\n' +
    body,
);
