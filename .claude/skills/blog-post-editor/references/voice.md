# Voice — house voice: sad-funny, serving the technical core

Target: Bukowski plainness × Pratchett absurdity carrying technical posts. The pain is real, the joke is how it's said, the explanation is exact.

## Voice serves the core

- Voice lives in: opening story, stakes, transitions, section edges (first/last sentence), results, ending, short asides.
- Explanations run plain and exact. A joke may follow an explanation step; never interrupt it or replace a technical term.
- Never trade precision for a punchline; never swap a term for a jokey synonym.
- A joke that makes the reader re-read the technical point → cut it or move it after the point.
- Voice density drops as technical density rises: heavy section → one beat at its edge.

## Axis S — the sad (Bukowski traits)

- S1 plain words, short declaratives, few adjectives, no ornament
- S2 admits cost flat — failure, fatigue, money, time, being wrong. States it, moves on. No self-pity spiral, no redemption sermon.
- S3 mundane concrete detail anchors scenes: the hour, cold coffee, the invoice, fan noise
- S4 deflates hype, authority, grand claims, best-practice piety
- S5 endings don't lie: no fake triumph

## Axis F — the funny (Pratchett traits)

- F1 absurd premise followed with rigorous logic
- F2 tools/systems personified with petty motives (the linter holds grudges)
- F3 footnote asides that undercut or extend — MDX footnotes `[^n]` only if the blog renders them (survey); else parenthetical or the conventional aside component
- F4 comic precision: oddly exact numbers, over-specific qualifiers
- F5 mock-grand Capitalised Concepts — ≤2 per post
- F6 quiet truth inside the joke; kindness to people, mockery for systems, pomposity, self

## Blend

- Beats: flat admission → absurd reframe · absurd setup → flat bruise punchline · precise detail → deadpan understatement.
- Every section ≥1 voiced beat; in technical sections, at its edges.
- Quips in ≥3 consecutive sentences = sitcom. Whole narrative section without lift = manual/diary.
- Rhythm: short punches + an occasional longer rolling sentence (never inside an explanation). Uniform length = flag.
- Register: first person, conversational, specific.

## Section tags (for your own queue triage)

`sad-funny` target · `sad` bleak, no lift · `funny` quips, no weight · `flat` neutral/manual (fine for pure procedure/code) · `corporate` never fine.

## Flags

- V1 corporate/LLM register: leverage, unlock, seamless, robust, delve, dive in, journey, game-changer, supercharge, empower, cutting-edge, "in today's fast-paced world", "it's worth noting", "let's explore", "in the realm of"
- V2 enthusiasm: exclamation marks for excitement, amazing/awesome/incredible, hype emoji
- V3 hedge stacks: "might possibly", "sort of kind of", "I think maybe"
- V4 uniform rhythm: ≥5 consecutive sentences of similar length/structure
- V5 sitcom density (see Blend)
- V6 unrelieved bleakness: section ends on a bruise with no lift, not intended as a beat
- V7 explained joke: a sentence after a punchline explaining it
- V8 pastiche tells: named homage, imitated famous characters/lines, booze/profanity/wizard clichés as costume, ALL-CAPS speech imitation
- V9 sentimentality: moral-of-the-story, inspirational poster lines
- V10 punching down: jokes at readers, users, colleagues, groups
- V11 voice in the way: joke/aside inside a step sequence or mid-explanation; metaphor replacing a technical term

## Options for VOICE questions

- A voiced rewrite · B plainer rewrite (same register, less ornament) · Keep. Obvious V1 swaps → mechanical batch.
- Facts, numbers, code, links, terms identical.
- Amplify the author's idiom; build on nearby good lines; never rewrite lines already on-voice.
- Exaggerate stated facts; never fabricate new ones.
- Match the post's language.

## Calibration (illustrative, original)

Technical passage: clarity + voice at the edge

- now: "We implemented a write-through cache with TTL-based invalidation and a stale-while-revalidate strategy to mitigate thundering herd issues on cache expiry."
- A: "We put a cache in front of the database, with two rules. When data changes, the cache is updated in the same step (write-through). When an entry outlives its time-to-live (TTL), the old copy keeps being served while one request fetches a fresh one (stale-while-revalidate). The second rule is the one that matters. Without it, the moment a popular entry expires, every request misses at once and stampedes the database: the thundering herd. Databases, like people, do not enjoy a thousand identical questions in the same second."

Flat → sad-funny

- now: "We deployed the migration on a Friday at 5pm. It failed over the weekend and I spent Saturday fixing it. Deploying on Fridays is generally considered bad practice."
- B (plain): "We deployed the migration on a Friday at 5pm. Everyone knows not to. We did it anyway, and I spent Saturday fixing it."
- A (voiced): "We shipped the migration at 5pm on a Friday, the software equivalent of lighting a cigarette at a petrol station.[^1] It held until Saturday morning. I spent the rest of Saturday explaining to the database what it used to believe.
  [^1]: Nobody gets fired for this. Several people have been quietly ruined by it."

Corporate → plain

- now: "This approach allows us to leverage edge caching to unlock seamless performance."
- B: "Edge caching made it fast."
- A: "We put the cache at the edge. The pages got fast. Nobody said thank you, which is how you know it worked."

Opening, facts missing → ask first

- now: "Observability is crucial for modern distributed systems. In this post we'll explore how we set up tracing after an incident in March."
- ask: "What broke first in March?" → options inferred from the post + Other; then "How did you find out?"; then the rewrite question.
- skeleton the rewrite fills: "March. [what broke]. The dashboards were green, all of them, with the innocence of a dog sitting next to a shredded sofa. [how you found out]. That was the week we stopped trusting dashboards and started tracing."

Ending with callback

- now: "In conclusion, tracing is a powerful tool for any team. Let me know your thoughts in the comments!"
- A (callback: green dashboards): "The dashboards are still green. Now I know exactly how much they're lying."
- B: "Tracing won't stop the next outage. It just tells you, to the millisecond, whose fault it was. Usually mine."
