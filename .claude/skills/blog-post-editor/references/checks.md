# Checks

Each issue → one question (SKILL.md §Question format). Recommended option first; Keep + Other always present.
Queue: Pass 1 DUP(synopsis) → OPEN → FLOW → END · Pass 2 per section top→bottom: CLARITY → RED → VOICE → COMP/PAT · Pass 3 NEW.

## Spine

Posts explain a strategy for fixing a problem:
problem → why it hurts / constraints → strategy (the decision; rejected alternatives ≤1 sentence each) → how (implementation) → result (evidence: numbers, before/after) → ending (lesson, callback).
Each section advances one spine step. Voice frames the spine; never replaces or delays it.

## DUP — duplication

Scope

1. synopsis ↔ body (Pass 1). Synopsis = frontmatter field (synopsis|sypnosis|summary|excerpt|tldr|lede|abstract|description) or synopsis-like component. Several → check each and pairwise.
2. title ↔ synopsis ↔ first paragraph restating one sentence.
3. intra-post repeats; component content restating the adjacent paragraph (Pass 2, asked with RED).
4. cross-post reuse from siblings (Pass 2).

Rules: synopsis frames the post (problem + promise/angle); shares no ≥6-word run with the body; not paraphrased by paragraph 1; body doesn't open with it. Pull-quote repetition OK only as sibling convention (PAT).
Evidence: `post` verbatim runs, coverage, paraphrase suspects, intra/cross runs + semantic pass (synopsis claims → body locations).
Options

- synopsis: A problem-led rewrite · B hook-led rewrite (both within schema length) · Keep
- body is the copy (synopsis pasted as paragraph 1) → fold into the OPEN question
- intra: A cut the weaker instance · B merge both into one · Keep
- cross-post: A reword in target · Keep (siblings never edited)

## OPEN — opening as story, reaching the problem fast

Target: text before the first heading + first section if it states why the post exists; sections titled why/motivation/background/context.
Story test: concrete moment (when/where) · protagonist (author/team) doing something · trigger (breaks, costs, surprises) · stakes · turn into the post's subject.
Speed: problem visible within ~120 words. The story is the vehicle for the problem, not a detour.
Fail signals: abstract rationale, rhetorical question, trend framing ("In today's…"), definition opener, table-of-contents opener, apology opener, long backstory before the problem.
Facts present → A voiced story from existing facts · B shorter, plainer story · Keep.
Facts missing → ask first, one question at a time (what broke, how it surfaced, what it cost), candidate answers as options where inferable; then the rewrite question.

## FLOW — reader flow around the core

- Spine present and in order. Missing step (typically: strategy stated plainly, or result/evidence) → ask for material or propose a reorder.
- Core strategy stated plainly in 1–2 sentences by the end of the first body section.
- Fluff: tangents, extra backstory, preamble paragraphs, asides longer than the point they decorate, joke runs inside explanations → cut · compress · move to footnote/aside component (per convention).
- Transitions: a section's first sentence connects to the previous section's last point; jumps → bridging sentence.
- Order: a section depending on a later one → reorder.
- Headings name the step; clever headings fine if the meaning survives.
  Options: A structural fix (outline for moves; text for local fixes) · B lighter fix · Keep.

## CLARITY — technical breakdown for a mixed audience

Goal: a non-technical reader gets the problem, the strategy and why it works from prose alone; a technical reader gets specifics from code, details, components.
Flags

- concept stack: >2 new concepts in one sentence
- jargon/acronym without a gloss at first use (script: unexpanded acronyms; common ones → judge for mixed audience)
- missing mechanism: vague stand-ins ("various optimizations", "some magic", "handles it under the hood", "it's complicated") → name the mechanism in one clause
- explanatory sentence >30 words (script: long sentences)
- detail before point: specifics before saying what they achieve
- number without unit or baseline ("much faster", "3×" of what)
- analogy that misleads or needs its own explanation; >1 analogy per concept
- hedged explanation ("basically kind of works like")
  Techniques (options draw from these)
- point first, detail after — per section and per paragraph
- one idea per sentence; split stacks into 2–4 short sentences
- inline gloss ≤1 clause at first use: "a reverse proxy (a server that sits in front of yours and forwards requests)"
- one precise analogy mapped to the real mechanism, then back to the real terms
- numbered steps for sequences (steps component if one exists)
- deep detail → code comment, details/aside component, or footnote per convention
- results as before/after with numbers
  Terse ≠ vague: cut words, never the mechanism. Precision vs simplicity conflict → keep the precise term and gloss it.
  Options: A plain breakdown (point first, glosses, steps) · B analogy-led · C keep technical, add a one-line plain summary before it · Keep.

## RED — redundancy

Targets: throat-clearing, signposting, restated conclusions, recap sections, several examples for one point, synonym/hedge stacks, intensifier filler, prose narrating code line-by-line, sentences announcing the next sentence, one explanation given twice in different words.
Guard: deliberate repetition for rhythm (rule of three, callback, running gag) is voice — leave it.
Options: A cut · B compress/merge (show text, `−<n>w`) · Keep. Filler words → batched mechanical question per section.

## END — ending

Conclusive: resolves the opening's tension; delivers the promised strategy/result; callback to an opening image/detail (preferred); no new topic.
Fun: last line lands — deadpan, understatement, sad-funny turn; short.
Fail signals: "In conclusion / To sum up", bullet recap, generic CTA ("let me know in the comments", "happy coding"), poster line, ending on links or questions, fading out.
Sibling convention of a closing component (series nav, subscribe) → keep it; the voiced last line precedes it.
Options: 2–3 final-paragraph variants ≤60w, each labeled by its callback · Keep.

## COMP — component leverage

Prereq: survey + component sources read. Only existing components, real props/slots, the collection's import convention.
Shape → component from survey samples (what each actually wraps), not names. Shapes: warning/gotcha, metric, comparison, before/after, steps, timeline, code with filename/annotation, terminal output, file tree, definition, quote, aside/tangent, details/collapsible, image+caption, diagram, embed.
Priority: components that carry CLARITY (steps, diagrams, before/after, details for deep dives) and FLOW (asides for tangents).
Flags: shape siblings wrap in X rendered as prose here · X clearly fits and is unused/rare · props contradict source · misuse vs convention · overuse (>1 highlight per ~150w, back-to-back blocks). Unused/missing imports → mechanical batch.
Options: A insert (MDX incl. import if not global) · B other component or placement · Keep.

## PAT — highlight conventions

From survey + sibling reads: position (opens/closes with X), section type → treatment, density (components per 1k words), footnote habits, heading depth.
Convention = ≥60% of sampled siblings AND ≥3 posts; below = option, not a question.
Deviation → question; recommend Keep when it looks intentional (different post type, series). Same span as a COMP question → merge.

## VOICE

`references/voice.md`. ≤2 VOICE questions per section; one question may cover several lines as one drop-in block.

## NEW — experimental component

Budget ≤1 per session; strong fit only.
Trigger (all): a shape in the target (ideally also in ≥1 sibling) that existing components render poorly and prose handles clumsily · no existing component covers it (one could with a new prop → propose that extension instead) · not rejected in the ledger.
Candidate shapes: incident timeline; expectation vs reality; cost/time accumulating across steps; decision tree; things tried in order; annotated log/stack trace; versus table with verdict; request/data-flow diagram; before/after architecture; margin notes for footnote-heavy posts.
Question 1: "§ <heading> has <shape>; <existing components> don't fit because <reason>. Spec a new `<Name>`?" → A show spec · B not now · C don't suggest again (ledger).
On A → spec:

```
name · purpose · why not existing
file: <existing component dir + naming convention>
props: interface Props { … } · slots
render: static .astro, semantic HTML, no client JS unless interaction is essential (justify client:*)
a11y: semantics, contrast, prefers-reduced-motion
use here: <MDX replacing the span> · reuse: <sibling slugs>
```

Question 2: A scaffold it + use here · B keep the spec only (built elsewhere) · C drop. Scaffold writes only the new component file + the target post.
