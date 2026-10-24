# yukamiya.me — Design direction

Discovery proposal · 19 October 2026 · Visual system to approve before implementation

## Positioning: make the work legible

The strongest identity is a technical leader who connects practical AI implementation with changes to how organizations work. Repository evidence spans AI adoption management, engineering evaluation, QUREO project leadership, developer relations and Tech DE&I. “Technical Program Management” is a useful description of capabilities, but the repository does not establish it as the current official job title. Do not invent a title to fit a recruiter keyword.

Candidate homepage headlines:

1. **Advancing AI adoption across engineering organizations.** Recommended: direct, intelligible and supported by current work. Use the supporting sentence to establish hands-on depth.
2. **Leading the work between AI capability and organizational change.** Broader and more distinctive; slightly abstract, so it needs specific project evidence immediately below.
3. **Applied AI, from evaluation to everyday engineering.** Strong for applied AI/developer productivity audiences; less explicit about leadership.
4. **Building the practices that help teams work effectively with AI.** Human and clear; softer seniority signal unless the current role and scope are prominent.

Recommended opening composition, as draft copy for owner review:

> Yu Kamiya / 神谷 優  
> **Advancing AI adoption across engineering organizations.**  
> I work across AI adoption, evaluation, and engineering workflows—connecting technical decisions with how teams learn, collaborate, and deliver.  
> Manager, AI Driven Office · Tech DE&I Lead · CyberAgent  
> Selected work → · Get in touch →

Draft Japanese direction: **AIを、開発組織の実践へ。** Supporting copy should explain evaluation, workflow design and organizational change in natural Japanese rather than translating the English word for word. Confirm current titles and preferred English wording before publication.

Avoid “AI visionary,” “revolutionizing,” “10×,” unqualified “executive,” or “global AI leader.” Global readability comes from explaining work and scope, not asserting status. Technical depth belongs in decisions, evidence and limitations.

## Three differentiated directions

### A — Leadership Brief

**Personality:** composed, exact, restrained. A professional brief that can be understood in thirty seconds.

**Typography:** one high-quality sans family, medium-weight headings rather than oversized black weights; system Japanese fallback initially. Body 18–20px; display 56–68px desktop / 34–40px mobile. Mono used only for small factual annotations if needed.

**Grid/layout:** 12-column desktop grid, 1,160–1,200px content maximum. Hero copy takes eight columns; a compact portrait takes four. Work appears as three generous horizontal rows with role and evidence in a narrow metadata rail.

**Spacing:** 96px between desktop sections, 48–56px mobile; 8px base scale; typography and rules create structure, few containers.

**Images:** modest portrait; diagrams or source artifacts only where they clarify a decision. No ornamental project thumbnails.

**Color:** paper white, near-black, one deep blue or plum accent. High-contrast links, subtle gray rules. No gradient backgrounds or shadows as decoration.

**Motion:** none on entry; 120–180ms color/underline transitions. Everything visible without JavaScript.

**Homepage sequence:** concise positioning → proof of current scope → selected work rows → selected recognition/publications → contact.

**Fit:** clearest for executive and recruiter scans; conveys seniority through restraint. **Risk:** can feel like a consulting brochure or résumé if the work lacks narrative and personal warmth.

### B — Working Perspective

**Personality:** thoughtful, human, editorial. The site feels authored by a practitioner with a point of view.

**Typography:** a restrained serif for a few English display headings paired with a clean sans for body, navigation and data. Existing Instrument Serif and DM Sans are reasonable starting candidates because they are already in the design, but not a reason to preserve the current implementation. Japanese display uses a deliberate Japanese face or sans fallback, never accidental Latin-serif substitution. Limit weights and verify the font licenses before self-hosting.

**Grid/layout:** asymmetrical 7/5 hero, photo with a simple caption; long-form case studies use a 65–70ch reading column plus a narrow evidence rail. Selected work alternates a prominent first story with smaller secondary stories. Speaking/writing is an editorial list, not a wall of cards.

**Spacing:** 80–112px between major desktop sections, 40–64px mobile; smaller gaps within related evidence. Thin rules and paragraph rhythm organize content.

**Images:** natural-color photography, square or lightly rounded corners, no shadow. The repository's red-sweater portrait (`site_profile_1.jpg`) has useful conversational character and negative space; test crops without placing text over the face. The laptop portrait remains a viable secondary image. Neither asset should be presented as a new photograph.

**Color:** warm paper `#F7F5F0`, ink `#202522`, muted gray `#5D655F`, deep green `#234C42` for links and emphasis. Color values are starting tokens, subject to contrast testing; pale tints are backgrounds, not text colors.

**Motion:** quiet hover/focus feedback only. No marquee, staged text reveal, parallax or page-transition spectacle.

**Homepage sequence:** positioning + portrait → lead case study → two supporting cases → selected speaking/writing → short personal leadership perspective → contact.

**Fit:** best balance of technical credibility, leadership and the human side of organizational transformation. **Risk:** a dominant serif or oversized photograph could make it look like a lifestyle publication. Keep proof ahead of personal narrative and position before image on mobile.

### C — Practice & Systems

**Personality:** analytical, concrete, product-minded. Makes the machinery behind outcomes visible.

**Typography:** sans throughout with tightly limited mono labels for dates, roles and diagram annotations; no terminal aesthetic. Larger explanatory captions than ordinary engineering documentation.

**Grid/layout:** modular 12-column system; each work story begins with context, a decision, and evidence. One restrained workflow diagram per relevant case. Metadata columns collapse into ordered text blocks on mobile.

**Spacing:** 72–96px major spacing, denser evidence tables; explicit separation between claims and supporting detail.

**Images:** small portrait; workflow diagrams and actual approved artifacts get more room. Never substitute invented dashboards for evidence.

**Color:** off-white, charcoal and deep indigo; subtle gray panels, no glowing accents. Diagram color encodes meaningful distinctions and is accompanied by text.

**Motion:** optional disclosure only; diagrams remain static and have text equivalents. No animated “AI” simulation.

**Homepage sequence:** role + practice statement → three domains → project decision/outcome summaries → selected technical writing → background/contact.

**Fit:** strongest for applied AI and technical program audiences. **Risk:** can overemphasize implementation mechanics and hide the human leadership story; too many small panels recreate an engineer portfolio.

## Recommendation: B with A's hierarchy

Choose **Working Perspective**, constrained by the scanability of Leadership Brief. Use C's clear diagrams inside case studies rather than making the whole site a technical dashboard.

This follows the evidence: the work combines organizational change with engineering practice, and the repository already has authentic photography and a substantial speaking/research history. A purely executive treatment would underplay that voice; a purely technical treatment would undersell the leadership scope. The blend is specific to the material, not an aesthetic default.

## Homepage information hierarchy

```text
NAME                                  Work  Speaking & Writing  About  Contact  EN/JA
──────────────────────────────────────────────────────────────────────────────────
AI adoption / technical leadership    Portrait (supporting, not full-bleed)
Headline + short explanation
Current role + selected-work/contact links
──────────────────────────────────────────────────────────────────────────────────
SELECTED WORK
01 Engineering AI adoption            Scope · My role · Decisions · Outcome
   Lead story + one grounded fact     Read the case study →
02 AI-assisted review                 Evaluation + human judgment
03 QUREO translation workflow         Product + technical tradeoffs
──────────────────────────────────────────────────────────────────────────────────
SPEAKING & WRITING                     Three selected items, language/date/type
──────────────────────────────────────────────────────────────────────────────────
ABOUT THE PRACTICE                     Short leadership/personal perspective
CONTACT                               Clear invitation + working contact route
```

On mobile: name/nav → headline → explanation/current role → CTA → compact photo → lead work. No full-height hero. Scope evidence should appear close to the lead story; do not isolate numbers into decorative “stats” when their meaning requires context.

A visitor should be able to answer in ten seconds: who is this, what work do they lead, and where is the evidence? In thirty seconds: what did they personally do, what changed, and how do I contact them?

## Typography and visual rules

- Use one centralized token file for space, color, type, border, container and motion. No separate Home/About design systems.
- Start body at 18px with ~1.6 line height for English and ~1.8 for Japanese. Headline sizing must accommodate real Japanese and long English titles at 320px without clipping.
- Serif is a selective editorial accent, not a blanket rule for every heading. Avoid low-contrast thin display text and all-caps body copy.
- Use a consistent 8/16/24/32/48/64/96 spacing family, fluid where appropriate. Align text to a shared grid rather than compensating with isolated margins.
- Keep corners mostly square or 4px; reserve pills for functional labels, not every credential. Prefer rules and whitespace to boxes and shadows.
- Show original publication language, date precision, source and personal role. A talk title alone is not an impact story.
- One small recognition row is sufficient. No logo cloud suggesting clients, endorsements or relationships not documented.
- Mark target metrics as targets and scope figures as scope. No fabricated testimonial, graph, screenshot, accomplishment or quantified impact.
- Use self-hosted, licensed font subsets when practical; do not preload a large Japanese character set. Define robust fallbacks and measure layout shift.
- Keep links recognizable without relying only on color; provide visible keyboard focus and reduced-motion behavior.

## Design checkpoint and implementation proof

Approve the overall B+A direction and headline concept before the full UI. The next design slice should render a real homepage and one case-study opening at desktop, tablet and mobile, with actual bilingual content. Judge that rendering before scaling the system to secondary pages. This document is a direction proposal, not a claim that typography, accessibility or composition has already been validated in the new site.
