# ΕΤΑΙΡΕΙΑ Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `/about` page placeholder (which just renders the home-page About teaser) with a content-rich dedicated company page driven by the copy from `site mpourtzila.docx` — Η εταιρεία intro, Ο ιδρυτής bio, and a ΟΛΟΚΛΗΡΩΜΕΝΑ project list (5 buildings).

**Architecture:** Add a typed content file (`src/content/about/data.ts`) that holds all Greek copy as exported constants. Build four small, single-responsibility Astro components under `src/components/about/` — `CompanyIntro`, `Founder`, `CompletedProjects`, `ProjectCard`. Compose them inside `pages/about.astro`. Reuse existing design tokens (`--bronze`, `--ink`, `.section`, `.section--whisper`, `.eyebrow`, `.section-title`, `.body-copy`, `data-reveal`, `data-split-title`) so the existing GSAP choreography in `scripts/main.ts` runs without modification. Images stay as styled placeholder slots (per user choice).

**Tech Stack:** Astro 6, TypeScript, GSAP/ScrollTrigger (already wired). No new dependencies. Verification via `astro check` + `curl | grep` content-presence checks against the running dev server on `http://localhost:4323/about` (no test runner in this repo — content-presence checks replace unit tests).

---

## File Structure

```
site/src/
├── content/about/
│   └── data.ts                       # CREATE — typed content for /about page
├── components/about/
│   ├── CompanyIntro.astro            # CREATE — "Η εταιρεία" intro + stats
│   ├── Founder.astro                 # CREATE — "Ο ιδρυτής" bio + portrait slot
│   ├── ProjectCard.astro             # CREATE — single completed-project card
│   └── CompletedProjects.astro       # CREATE — wraps section heading + card grid
└── pages/
    └── about.astro                   # MODIFY — compose the four new components
```

Each new component owns one clearly bounded UI block. The data file is the single source of Greek copy so future edits don't require touching markup.

---

### Task 1: Content data file

**Files:**
- Create: `site/src/content/about/data.ts`

- [ ] **Step 1: Create the data file**

```ts
// site/src/content/about/data.ts
export const companyIntro = {
  eyebrow: "ΕΤΑΙΡΕΙΑ",
  title: ["Η εταιρεία", "μας"],
  body: [
    "Η εταιρεία δραστηριοποιείται στον τομέα ανέγερσης νέων οικοδομών από το 1995. Έχει πραγματοποιήσει πλήθος έργων στην περιοχή Άνω Πατησίων, Λαμπρινής, Γαλατσίου και αλλού, ανταποκρινόμενη πάντα στις απαιτήσεις.",
    "Με έμφαση στην ποιότητα και τις νέες τεχνολογίες, ανταποκρινόμαστε στις ανάγκες των πελατών μας εφαρμόζοντας σύγχρονες μεθόδους δόμησης. Διατηρούμε σταθερές συνεργασίες με συνεργεία υψηλής τεχνικής κατάρτισης και επώνυμους προμηθευτές.",
    "Ο σχεδιασμός των κτιρίων μας ακολουθεί τα σύγχρονα πρότυπα και κανονισμούς και διαρκώς εξελίσσεται ώστε να παραμένει στην κορυφή.",
  ],
  stats: [
    { value: "30+", label: "έτη\nεμπειρίας" },
    { value: "1995", label: "έτος\nίδρυσης" },
    { value: "Κυπριάδου", label: "Αθήνα" },
  ],
} as const;

export const founder = {
  eyebrow: "Ο ΙΔΡΥΤΗΣ",
  name: "Παναγιώτης Μπουρτζίλας",
  bio: "Η εταιρεία μας ιδρύθηκε και λειτουργεί υπό τη διεύθυνση του Παναγιώτη Μπουρτζίλα, ο οποίος δραστηριοποιείται στον κλάδο των κατασκευών ύστερα από μεγάλη καριέρα στον τραπεζικό κλάδο. Πλέον στο έργο του συνδράμουν οι κόρες του Ευαγγελία και Ασημίνα, αρχιτέκτονες μηχανικοί.",
  successors: [
    { name: "Ευαγγελία Μπουρτζίλα", role: "Αρχιτέκτων Μηχανικός" },
    { name: "Ασημίνα Μπουρτζίλα", role: "Αρχιτέκτων Μηχανικός" },
  ],
} as const;

export type Project = {
  slug: string;
  title: string;
  period: string;
  area: string;
  body: string;
};

export const completedProjects: readonly Project[] = [
  {
    slug: "halepa-1",
    title: "Χαλεπά 1",
    period: "2011 – 2012",
    area: "Κυπριάδου · Αθήνα",
    body: "Τετραώροφη οικοδομή, κατασκευασμένη την περίοδο 2011 - 2012 σε ειδυλλιακό σημείο έναντι πλατείας Νικολοπούλου στην περιοχή Κυπριάδου του δήμου Αθηναίων. Το κτίριο είναι τοποθετημένο πανταχόθεν ελεύθερο με μεγάλες όψεις που προσφέρουν φυσικό φωτισμό και αερισμό και είναι από τα πρώτα κτίρια που εφαρμόστηκε ο νέος κανονισμός ενεργειακής απόδοσης ΚΕΝΑΚ.",
  },
  {
    slug: "markora-27",
    title: "Μαρκορά 27",
    period: "2016 – 2017",
    area: "Κυπριάδου · Αθήνα",
    body: "Ένα από τα μοντέρνα κτίρια της εταιρείας επίσης στην περιοχή Κυπριάδου, έναντι πλατείας Χαλεπά (ή Παπαλουκά) που κατασκευάστηκε την περίοδο 2016 – 2017. Είναι πενταώροφο με κατάστημα στο ισόγειο λόγω της θέσης του σε εμπορικό πέρασμα, με μεγάλη πρασιά και επιμήκεις, φωτεινές όψεις που βλέπουν πάνω στην πλατεία.",
  },
  {
    slug: "lykoudi-21",
    title: "Λυκούδη 21",
    period: "2018 – 2020",
    area: "Κυπριάδου · Αθήνα",
    body: "Σε ένα πιο ήσυχο σημείο της περιοχής Κυπριάδου βρίσκεται αυτή η γωνιακή πενταώροφη οικοδομή κατασκευασμένη περίπου την περίοδο 2018 - 2020. Είναι κατασκευασμένη με όλους τους σύγχρονους κανονισμούς, διαθέτει φωτεινά, διαμπερή διαμερίσματα με μεγάλα μπαλκόνια και δυναμική σχεδίαση με έντονα χρώματα στο γωνιακό έρκερ.",
  },
  {
    slug: "markora-29",
    title: "Μαρκορά 29",
    period: "2021 – 2022",
    area: "Κυπριάδου · Αθήνα",
    body: "Άλλο ένα πενταώροφο κτίριο έναντι της πλατείας Χαλεπά (ή Παπαλουκά) της περιόδου 2021 - 2022, φυσικά στην Κυπριάδου όπου εδώ ξεκινάει μία πιο δυναμική σχεδίαση όπου κυριαρχεί το κρυστάλλινο στηθαίο, οι όγκοι των μπλακονιών και οι υφές της εξωτερικής μόνωσης με μοντέρνες ανθρακί αποχρώσεις.",
  },
  {
    slug: "markora-33",
    title: "Μαρκορά 33",
    period: "—",
    area: "Κυπριάδου · Αθήνα",
    body: "Διασχίζοντας την οδό Μαρκορά από την πλατεία Χαλεπά προς την οδό Παπαδιαμάντη βρίσκουμε ένα αρχιτεκτονικά λιτό πεντάωροφο κτίριο με δύο τμήματα τα οποία χωρίζονται από το ενδιάμεσο αίθριο και καταλήγουν στον πίσω ακάλυπτο. Ένα πολύ ήσυχο",
  },
];

export const completedHeading = {
  eyebrow: "ΤΑ ΕΡΓΑ ΜΑΣ",
  kicker: "ΟΛΟΚΛΗΡΩΜΕΝΑ",
  title: ["Ολοκληρωμένα", "έργα"],
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd site && npx astro check 2>&1 | tail -20`
Expected: 0 errors, 0 warnings related to `content/about/data.ts`. (Pre-existing warnings in other files are fine — only watch for new errors in the new file.)

- [ ] **Step 3: Commit**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git add site/src/content/about/data.ts
git commit -m "content: add /about page copy data file"
```

---

### Task 2: ProjectCard component

**Files:**
- Create: `site/src/components/about/ProjectCard.astro`

- [ ] **Step 1: Create the component**

```astro
---
import type { Project } from "../../content/about/data";

interface Props {
  project: Project;
  index: number;
}

const { project, index } = Astro.props;
const num = String(index + 1).padStart(2, "0");
---

<article class="project-card" data-reveal style={`--idx:${index}`}>
  <div class="project-card__media" aria-hidden="true">
    <span class="project-card__num">{num}</span>
    <span class="project-card__corner project-card__corner--tl"></span>
    <span class="project-card__corner project-card__corner--br"></span>
  </div>

  <div class="project-card__body">
    <header class="project-card__head">
      <h3 class="project-card__title">{project.title}</h3>
      <p class="project-card__meta">
        <span>{project.period}</span>
        <span class="dot">·</span>
        <span>{project.area}</span>
      </p>
    </header>
    <p class="project-card__copy">{project.body}</p>
  </div>
</article>

<style>
  .project-card {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(1.5rem, 4vw, 3rem);
    align-items: start;
    padding: clamp(1.75rem, 4vw, 2.5rem) 0;
    border-top: 1px solid rgba(0,0,0,0.08);
  }
  .project-card:first-of-type { border-top: 0; }

  .project-card__media {
    position: relative;
    aspect-ratio: 4 / 3;
    background:
      repeating-linear-gradient(
        135deg,
        rgba(177,151,119,0.08) 0 14px,
        rgba(177,151,119,0.04) 14px 28px
      ),
      var(--whisper, #f7f4ef);
    display: grid;
    place-items: center;
    color: var(--bronze);
    overflow: hidden;
  }
  .project-card__num {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(3rem, 7vw, 5rem);
    letter-spacing: 0.05em;
    color: rgba(177,151,119,0.55);
    line-height: 1;
  }
  .project-card__corner {
    position: absolute;
    width: 2.25rem; height: 2.25rem;
    border-color: var(--bronze);
    border-style: solid;
  }
  .project-card__corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
  .project-card__corner--br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

  .project-card__body { min-width: 0; }
  .project-card__title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    color: var(--ink);
    margin: 0;
    letter-spacing: 0.02em;
  }
  .project-card__meta {
    margin: 0.5rem 0 0;
    font-family: var(--font-display);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--bronze);
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
  }
  .project-card__meta .dot { opacity: 0.55; }
  .project-card__copy {
    margin: 1.1rem 0 0;
    font-family: var(--font-body);
    line-height: 1.7;
    color: rgba(39,39,39,0.82);
    max-width: 38rem;
  }

  @media (max-width: 760px) {
    .project-card { grid-template-columns: 1fr; gap: 1.25rem; }
    .project-card__media { aspect-ratio: 16 / 10; }
  }
</style>
```

- [ ] **Step 2: Verify component compiles**

Run: `cd site && npx astro check 2>&1 | grep -E "ProjectCard|error" | head`
Expected: no new errors mentioning `ProjectCard.astro`.

- [ ] **Step 3: Commit**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git add site/src/components/about/ProjectCard.astro
git commit -m "feat(about): add ProjectCard component"
```

---

### Task 3: CompletedProjects component

**Files:**
- Create: `site/src/components/about/CompletedProjects.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { completedHeading, completedProjects } from "../../content/about/data";
import ProjectCard from "./ProjectCard.astro";
---

<section class="completed section">
  <div class="completed__inner">
    <header class="completed__head">
      <span class="eyebrow" data-reveal>
        {completedHeading.eyebrow} <span class="eyebrow-line" data-reveal-line></span>
      </span>
      <p class="completed__kicker" data-reveal>{completedHeading.kicker}</p>
      <h2 class="section-title" data-split-title>
        {completedHeading.title.map((line) => <span class="line">{line}</span>)}
      </h2>
    </header>

    <div class="completed__list" data-reveal-stagger>
      {completedProjects.map((p, i) => <ProjectCard project={p} index={i} />)}
    </div>
  </div>
</section>

<style>
  .completed__inner {
    max-width: var(--content-max);
    margin: 0 auto;
  }
  .completed__head {
    margin-bottom: clamp(2rem, 5vw, 3.5rem);
  }
  .completed__kicker {
    margin: 0.75rem 0 1.25rem;
    font-family: var(--font-display);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--bronze);
  }
  .completed__list {
    display: block;
  }
</style>
```

- [ ] **Step 2: Verify component compiles**

Run: `cd site && npx astro check 2>&1 | grep -E "CompletedProjects|error" | head`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git add site/src/components/about/CompletedProjects.astro
git commit -m "feat(about): add CompletedProjects list"
```

---

### Task 4: CompanyIntro component

**Files:**
- Create: `site/src/components/about/CompanyIntro.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { companyIntro } from "../../content/about/data";
---

<section class="company section section--whisper">
  <div class="company__grid">
    <div class="company__text">
      <span class="eyebrow" data-reveal>
        {companyIntro.eyebrow} <span class="eyebrow-line" data-reveal-line></span>
      </span>

      <h1 class="section-title company__title" data-split-title>
        {companyIntro.title.map((line) => <span class="line">{line}</span>)}
      </h1>

      <div class="body-copy stack" data-reveal-stagger>
        {companyIntro.body.map((p) => <p>{p}</p>)}
      </div>

      <dl class="stat-row" data-reveal-stagger>
        {companyIntro.stats.map((s) => (
          <div>
            <dt>{s.value}</dt>
            <dd>{s.label.split("\n").map((ln, i) => <>{i > 0 && <br />}{ln}</>)}</dd>
          </div>
        ))}
      </dl>
    </div>

    <aside class="company__mark" aria-hidden="true" data-reveal>
      <span class="company__year">1995</span>
      <span class="company__year-label">Από</span>
      <span class="company__rule"></span>
      <span class="company__seal">59ST · ΑΘΗΝΑ</span>
    </aside>
  </div>
</section>

<style>
  .company__grid {
    max-width: var(--content-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: clamp(2.5rem, 6vw, 5rem);
    align-items: start;
  }
  .company__text { min-width: 0; }
  .company__title { margin-top: 1.25rem; }
  .company__text .body-copy { max-width: 34rem; margin-top: clamp(1.5rem, 3vw, 2rem); }

  .stat-row {
    margin: clamp(2.5rem, 5vw, 3.5rem) 0 0 0;
    padding: clamp(1.75rem, 3vw, 2.5rem) 0 0 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(1rem, 3vw, 2.5rem);
    border-top: 1px solid rgba(0,0,0,0.08);
  }
  .stat-row > div { margin: 0; }
  .stat-row dt {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(2rem, 3.6vw, 3rem);
    line-height: 1;
    color: var(--ink);
    letter-spacing: 0.04em;
  }
  .stat-row dd {
    margin: 0.75rem 0 0;
    font-family: var(--font-display);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--bronze);
    line-height: 1.6;
  }

  .company__mark {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    align-content: end;
    aspect-ratio: 4 / 5;
    padding: 1.5rem;
    border: 1px solid rgba(0,0,0,0.08);
    color: var(--ink);
    background:
      repeating-linear-gradient(
        135deg,
        rgba(177,151,119,0.06) 0 18px,
        rgba(177,151,119,0.02) 18px 36px
      );
  }
  .company__year {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(3.5rem, 7vw, 5.5rem);
    line-height: 0.9;
    color: var(--bronze);
    letter-spacing: 0.02em;
  }
  .company__year-label {
    order: -1;
    font-family: var(--font-display);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--bronze);
    margin-bottom: 0.4rem;
  }
  .company__rule {
    display: block;
    width: 2.5rem;
    height: 1px;
    background: var(--bronze);
    margin: 1rem 0 0.85rem;
  }
  .company__seal {
    font-family: var(--font-display);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--ink);
  }

  @media (max-width: 900px) {
    .company__grid { grid-template-columns: 1fr; }
    .company__mark { aspect-ratio: 4 / 3; }
    .stat-row dt { font-size: 2rem; }
  }
</style>
```

- [ ] **Step 2: Verify component compiles**

Run: `cd site && npx astro check 2>&1 | grep -E "CompanyIntro|error" | head`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git add site/src/components/about/CompanyIntro.astro
git commit -m "feat(about): add CompanyIntro hero block"
```

---

### Task 5: Founder component

**Files:**
- Create: `site/src/components/about/Founder.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { founder } from "../../content/about/data";
---

<section class="founder section">
  <div class="founder__grid">
    <figure class="founder__portrait" aria-hidden="true" data-reveal>
      <span class="founder__monogram">ΠΜ</span>
      <span class="founder__corner founder__corner--tl"></span>
      <span class="founder__corner founder__corner--br"></span>
      <figcaption>
        <span>{founder.name}</span>
        <span class="line"></span>
        <span>Founder</span>
      </figcaption>
    </figure>

    <div class="founder__text">
      <span class="eyebrow" data-reveal>
        {founder.eyebrow} <span class="eyebrow-line" data-reveal-line></span>
      </span>
      <h2 class="section-title" data-split-title>
        <span class="line">{founder.name.split(" ")[0]}</span>
        <span class="line">{founder.name.split(" ").slice(1).join(" ")}</span>
      </h2>
      <p class="founder__bio body-copy" data-reveal>{founder.bio}</p>

      <ul class="founder__successors" data-reveal-stagger>
        {founder.successors.map((s) => (
          <li>
            <span class="founder__successor-name">{s.name}</span>
            <span class="founder__successor-role">{s.role}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>

<style>
  .founder__grid {
    max-width: var(--content-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: clamp(2.5rem, 6vw, 5rem);
    align-items: start;
  }
  .founder__text { min-width: 0; }

  .founder__portrait {
    position: relative;
    margin: 0;
    aspect-ratio: 4 / 5;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 30% 30%, rgba(177,151,119,0.16), transparent 60%),
      var(--ink);
    color: var(--canvas);
    overflow: hidden;
  }
  .founder__monogram {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(4rem, 9vw, 7rem);
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.85);
    line-height: 1;
  }
  .founder__corner {
    position: absolute;
    width: 3rem; height: 3rem;
    border-color: var(--bronze);
    border-style: solid;
  }
  .founder__corner--tl { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
  .founder__corner--br { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

  .founder__portrait figcaption {
    position: absolute;
    left: 1.25rem; bottom: 1.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-display);
    font-size: 0.5625rem;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--canvas);
    text-transform: uppercase;
    background: rgba(0,0,0,0.55);
    padding: 0.55rem 0.85rem;
    backdrop-filter: blur(2px);
  }
  .founder__portrait figcaption .line {
    width: 1.5rem; height: 1px; background: var(--bronze);
  }

  .founder__bio {
    max-width: 34rem;
    margin-top: clamp(1.25rem, 3vw, 2rem);
  }

  .founder__successors {
    list-style: none;
    padding: 0;
    margin: clamp(2rem, 4vw, 3rem) 0 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: clamp(1.5rem, 3vw, 2rem);
  }
  .founder__successors li {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .founder__successor-name {
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--ink);
    letter-spacing: 0.02em;
  }
  .founder__successor-role {
    font-family: var(--font-display);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--bronze);
  }

  @media (max-width: 900px) {
    .founder__grid { grid-template-columns: 1fr; }
    .founder__portrait { aspect-ratio: 4 / 3; }
    .founder__successors { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Verify component compiles**

Run: `cd site && npx astro check 2>&1 | grep -E "Founder|error" | head`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git add site/src/components/about/Founder.astro
git commit -m "feat(about): add Founder bio block"
```

---

### Task 6: Wire components into the /about page

**Files:**
- Modify: `site/src/pages/about.astro` (full rewrite — the file currently imports the home-page `About` teaser)

- [ ] **Step 1: Replace `pages/about.astro` contents**

```astro
---
import Layout from "../layouts/Layout.astro";
import Sidebar from "../components/Sidebar.astro";
import CompanyIntro from "../components/about/CompanyIntro.astro";
import Founder from "../components/about/Founder.astro";
import CompletedProjects from "../components/about/CompletedProjects.astro";
---

<Layout
  title="ΕΤΑΙΡΕΙΑ — 59ST ConstrAction"
  description="Η εταιρεία Μπουρτζίλα — ανέγερση νέων οικοδομών από το 1995 στις περιοχές Άνω Πατησίων, Λαμπρινής, Γαλατσίου και Κυπριάδου."
>
  <div class="shell">
    <Sidebar />
    <main class="stage">
      <CompanyIntro />
      <Founder />
      <CompletedProjects />
    </main>
  </div>

  <script>
    import "../scripts/main.ts";
  </script>
</Layout>
```

- [ ] **Step 2: Verify the dev server still responds**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4323/about`
Expected: `200`

If the dev server isn't running, start it first: `cd site && npm run dev` (in background).

- [ ] **Step 3: Verify all three sections render**

Run:
```bash
curl -s http://localhost:4323/about > /tmp/about.html
for s in "Η εταιρεία" "Παναγιώτη Μπουρτζίλα" "Ευαγγελία" "Ασημίνα" "Χαλεπά 1" "Μαρκορά 27" "Λυκούδη 21" "Μαρκορά 29" "Μαρκορά 33" "ΚΕΝΑΚ" "1995"; do
  if grep -qF "$s" /tmp/about.html; then echo "OK  $s"; else echo "MISS $s"; fi
done
```
Expected: every line prints `OK`.

- [ ] **Step 4: Verify nav active state still works**

Run: `curl -s http://localhost:4323/about | grep -o 'aria-current="page"[^<]*ΕΤΑΙΡΕΙΑ' | head -1`
Expected: a non-empty match (proves the Sidebar marks `/about` as active).

- [ ] **Step 5: Verify the home page teaser is unchanged**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4323/`
Expected: `200`. Then:
```bash
curl -s http://localhost:4323/ | grep -c "59ST"
```
Expected: a count `>= 2` (brand mark + About teaser still render on `/`).

- [ ] **Step 6: Commit**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git add site/src/pages/about.astro
git commit -m "feat(about): replace teaser with full company page"
```

---

### Task 7: Final type & build check

**Files:**
- None — verification only.

- [ ] **Step 1: Run the full type checker**

Run: `cd site && npx astro check`
Expected: `0 errors`. Pre-existing hints/warnings on untouched files are OK; no new errors on any file under `src/components/about/` or `src/content/about/` or `src/pages/about.astro`.

- [ ] **Step 2: Run a production build**

Run: `cd site && npm run build`
Expected: build succeeds, output ends with `Complete!` (or Astro's equivalent success message). Watch for any errors mentioning the new component paths.

- [ ] **Step 3: Manual visual check**

Open `http://localhost:4323/about` in a browser. Confirm:
- Three distinct sections in order: company intro (whisper background), founder (white), completed projects (white)
- Active nav link shows ΕΤΑΙΡΕΙΑ underlined in bronze
- Eyebrows + section titles animate on scroll (GSAP reveals fire)
- Layout collapses to single column below ~900px

This is a human-only step — the only one in the plan that an LLM can't auto-verify. Note the result, then continue.

- [ ] **Step 4: Final commit (only if Step 2 produced changes such as updated `astro.config.mjs` or build artifacts that should be tracked — otherwise skip).**

```bash
cd /Users/marios/Desktop/Cursor/kataskeuastiki
git status
# If clean, no commit needed.
```

---

## Out of scope (explicit non-goals)

- Wiring `/projects` to render the same project list — the user chose "All on /about" for this plan. A future plan can DRY by reusing `ProjectCard` + the same data module on `/projects`.
- Real project / founder photography — placeholders intentional (per user choice).
- Filling in the truncated Μαρκορά 33 paragraph — used as-is per user instruction. Edit `data.ts` later when full copy arrives.
- SEO/structured data, hreflang, sitemap entries — separate plan.
- Adding test infrastructure (Vitest, Playwright). This repo has none; content-presence checks replace unit tests here.
