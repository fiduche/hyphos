# Positioning and content — hyphos.io

Written 21 September 2026. Why the site says what it says, what is written but
not deployed, what may never be published, and the open questions. Read this
before writing marketing copy or a field note.

---

## The argument the site now leads with

Everyone is building "AI systems": an assistant wired to some tools, a few API
connections, demonstrated on a clean example. Hyphos is differentiated by being
built to be **wrong in public and survive it**.

The sharpest version, and the one on the homepage:

> **AI is brilliant on one meeting. It falls apart on twenty hours.**

Nobody selling agents says this, because every demo is a one-meeting demo.
Daniel hit the wall himself on a consulting engagement: twelve-plus hours of
recorded meetings, and the agent reported the review as done when it had
skimmed. It only worked when the method was specified: one full pass per
transcript, findings with line references, merge afterwards. Slower, more
expensive, and it found what the first answer missed.

Why it breaks at volume, in the order the homepage says it:

1. **It answers from memory, not from your file. “Hallucination”** The quoted
   word sits in this point's label, not in the section headline: readers
   connect it to what they have heard elsewhere without the page lecturing
   them. It is not invention for its own sake: it holds a fragment of the
   source, fills in the rest from that fragment, and believes the result,
   because it did not go back to the full document unless explicitly told to.
   Daniel's correction, 21 Sept: do not describe this as making things up.
2. **It can miss what you changed.** Not always, and the hedge is deliberate:
   Daniel's correction, 21 Sept. You hand over the transcript and assume the
   reversal was captured. Retrieval finds what matches the question, and a
   reversal ("forget that, the client won't wear it") shares no words with it,
   so without an explicit instruction and a decision log it can be passed over.
3. **It will not double check on its own.** Daniel's correction, 21 Sept: do
   not say it cannot check its own work. Asked directly, it goes back and finds
   real errors, routinely. What it does not do is start that itself, so at
   volume the checking depends on a person remembering to ask every time, for
   every answer.
4. **It says it read everything.** Completion is a claim, not an event, and the
   skimmed summary looks like the thorough one.
5. **It forgets the conversation as it gets longer. “Compaction”** A long
   session is compressed into a summary so it can continue. Detail goes, and
   the premise of the task can go with it. Nothing reports what was dropped, so
   the first sign is an answer that contradicts something settled an hour
   earlier. Added to the homepage 21 Sept at Daniel's request: almost nobody
   outside the tooling knows this is happening. See "Compaction of
   conversations" below for the long version.

### How much is "a lot"? The scale numbers on the homepage

Arithmetic, not a benchmark, and stated as approximations on the page. Redo it
before restating it anywhere.

| Figure | Working |
|---|---|
| 750,000 words | A 1M token window (Claude Opus 5 today) at ~0.75 words per token. |
| ~1,500 pages | 750,000 words at ~500 words a page. |
| ~80 hours of meetings | Speech runs ~150 words a minute, so ~9,000 words an hour. Speaker labels and timestamps cut this, hence "about". |
| 12 hours | Daniel's own incident, the one in field note 06. |
| 15% | 12 hours is ~108,000 words, ~14.4% of 750,000. |

The point the numbers make is the one people miss: **the window was never the
constraint.** It failed at about a seventh of what it could hold, which is why
"just wait for a bigger context window" is not an answer. Do not name a model
version on the page; it dates. Say "the biggest models today".

And the line worth keeping: **the errors are not evenly spread.** They land on
the exception, the reversal, the job that went wrong: exactly what was being
asked about.

**Do not say a better prompt cannot fix this.** Daniel's correction, 21 Sept: it
can, he does it by hand, and claiming otherwise is both false and insulting to
the reader who has managed it. The true claim is about effort and skill. Doing
it well means knowing exactly what to ask for and asking every single time, and
at volume that becomes the job itself.

The fix is that the checking happens on its own, which is what Hyphos is:
answers tied to their source, checked against that source automatically, and a
count of what has actually been read. Say it that way. "Structural" and "what
holds without you" were both rejected on 21 Sept as jargon nobody parses.

---

## What is written but NOT deployed (as of 21 Sept)

| Change | Path |
|---|---|
| Homepage section "Why Not Just Ask Claude Or ChatGPT?" | `src/pages/index.astro` (`#the-wall`) |
| Rewritten "10 ways" field note (four controls, five questions to ask a vendor) | `src/pages/field-notes/ten-ways-small-businesses-use-ai.astro` |
| Field note 05, reading order | `src/pages/field-notes/the-decision-it-missed.astro` |
| Field note 06, the twelve-hour skim | `src/pages/field-notes/it-said-it-read-everything.astro` |

All build clean, no em dashes, checked at desktop and phone widths. Deploy is
`npm run build` (Node 22) then `npx wrangler deploy` from this repo.

---

## The series: "Working With AI On Your Own Files"

Short posts, one technique each, each ending with a twenty-minute exercise on
the reader's own documents. 05 and 06 are written.

| # | Post | Technique |
|---|---|---|
| 05 | The Decision It Missed Was Reversed Three Weeks Ago | Reading order beats search |
| 06 | It Said It Had Read Everything. It Hadn't. | Make it name sources, show lines, admit what it skipped |
| 07 | Make It Quote, Then Check Three | Catching a paraphrase dressed as a quote |
| 08 | Never Delete, Supersede | A decision log that survives changing your mind |
| 09 | Stop Writing The Document | Generate the deliverable from the table so it cannot drift |
| 10 | Look For The Contradictions First | The highest-value hour in a pile of material |
| 11 | What Counts As Proof | Quoted, documented, derived, assumed |
| 12 | Tomorrow It Forgets Everything | What to write down so the next session starts where this one ended |
| 13 | Don't Let It Overwrite Your Work | Habits that stop a helpful tool destroying an afternoon |

Undecided: whether each post gets a **training module** (the exercise done
properly, with prompts and a copyable template), and whether modules are free
pages, email-gated templates, or a paid workshop. Recommendation on file: build
modules for 05, 06 and 07, gate the templates behind an email, price a workshop
once three exist.

---

## IP rule: what may be published, and what may not

The method (anchoring, checking quotes, superseding, generating documents from a
register) is **not the moat**. It is audit and traceability practice pointed at a
chat window, it works by hand at single-file scale, and teaching it makes the
case for the product: anyone who tries it concludes that doing it by hand at
volume is unsustainable.

**Publish freely:** the principle, why the failure happens, the manual method at
single-file scale, and outcomes as numbers.

**Never publish:**

- Schema shapes or column designs.
- The design of the verification pipeline: how many checks, in what order, what
  is deterministic versus model-judged.
- Domas's governed build loop in buildable detail: how entry receipts are
  earned, what the holds are, how approval binds, how prior-art gates work.
  **This is the crown jewel and the most copyable idea in the stack.** Name
  Domas, describe what it achieves, never how it is constructed. Do not write a
  Domas field note.
- Tenant isolation design, the ontology and graph model, any prompt used inside
  the product.
- Anything that reads like a build spec rather than a working habit.

The test for any paragraph: **does this help a reader do better work on Monday,
or help a competitor skip a year of building?**

Protection against competitors parroting the language is specificity they cannot
match: real numbers, real refusals, real incidents.

---

## Verified evidence behind the claims (checked 20 September 2026)

Do not restate these without opening the source again.

**Cornerstone** (`~/Developer/Cornerstone SQL`)
- AI content inserts at `pending_approval`; a state machine with role checks and
  an audited transition table governs every move (`api_marketing.py:92`, `:779`,
  `:810`).
- Website changes publish only under an MFA-authenticated admin
  (`api_site_agent.py:501+`).
- Meeting-transcript suggestions are dropped when the model's quote cannot be
  matched in the transcript (`meeting_extraction.py:470-489`); numeric values
  must be quoted, not computed.
- Every AI generation stores prompt, model and output linked to the row it
  produced (`scripts/migrate_marketing_phase0.sql:43-60`).
- 169 tables, 104 migrations, 654 tests, 591 routes.
- Brand-guard regression test: the app refuses to boot if brand identity is
  undeclared, after a real near-miss on 2026-08-06.

**Hyphos** (`~/Developer/Hyphos`)
- Citation gate marks any unsourced factual sentence
  (`assistant-citation-gate.ts:415`, `:691`).
- A second model checks whether the cited passage supports the sentence
  (`assistant-evidence-verifier.ts:267`); structural claims are walked against
  the graph (`assistant-graph-verifier.ts:199`).
- Each client is a separate database (`partition.ts:15`, `:71`).
- Writes propose by default; direct write is a per-token grant
  (`mcp/tools/write-typed.ts:91`, `:155`).
- 387 migrations, 479 tables, 22,561 automated checks, 54 MCP tools per client.

**Do not claim:** automatic social posting (copy-paste until Meta approves), the
`negative_evidence` table (schema only, nothing reads or writes it), the generic
`approval_workflows` tables (orphaned), or mechanically enforced no-self-approval
(policy text, not a runtime identity check).

**Two leads worth checking in Hyphos:** the unused `negative_evidence` table is
the contradiction pass already designed; there is no corpus coverage ledger
("swept N of M sources, by pass, since this document arrived"), which is the
piece that would most directly retire the manual work.

---

## BaseMethod and Phasor: excluded on purpose

The day-job material (`~/Library/CloudStorage/OneDrive-Personal/BM`) is the most
advanced version of this method, and **none of it is on the site**. It carries
named clients, named client staff and email addresses, commercial terms, an SOW,
internal do-not-send assessments, and a second named client in another folder.
The playbook is also written as BASEMETHOD's method, so it may be their IP.

Posts 05 and 06 were written from scratch as general technique: no client, no
engagement, no employer, no quoted playbook text. Keep it that way unless Daniel
obtains clearance.

---

## Compaction of conversations

**This is an unsolved, recurring problem for Daniel, and it costs real money and
time.** Recording it here because it keeps being rediscovered. It is now also
the fifth point on the homepage, because most people using these tools have no
idea it is happening to them.

**What happens.** A long working session fills its context, gets summarised, and
the summary becomes the new working memory. What survives is what the summariser
judged important, not what was actually load-bearing. Then:

- Facts that were corrected come back wrong. In this very session, "Okotoks"
  had to be removed from the site, the hole board and the docs because an earlier
  pass wrote it in and it survived every summary since. A wrong fact travels
  better than the correction.
- Decisions are re-litigated. Work already settled gets re-derived, or worse,
  silently redone differently.
- Verification is lost first. "This claim was checked against `file:line` on this
  date" is exactly the kind of detail a summary compresses away, and it is the
  detail the next session needs most.
- Nobody can see what was dropped. The summary reads complete. There is no
  coverage statement, which is the same failure the homepage now describes in
  the product: a claim of completeness with no denominator.
- Cost compounds. Re-reading, re-deriving and re-checking are paid for twice,
  and the second pass is usually worse because the original reasoning is gone.

**What has actually worked in this session:**

1. **Write durable facts into the repository, not the conversation.** File
   comments that name what was verified and when; `INFRASTRUCTURE.md` rules;
   this document. Anything that must survive goes into a file a future session
   will open.
2. **Memory files for corrections.** The Calgary correction is now a memory note
   so it cannot come back a third time. Corrections deserve durable storage more
   than facts do, because they are what summaries lose.
3. **A written index of unfinished work.** The "built but not deployed" table
   above exists so a compacted session does not deploy blind or forget entirely.
4. **Re-read before asserting.** After a compaction, open the file rather than
   trusting the summary's description of it.

**Next steps, when there is appetite:**

- A short pre-compaction ritual: write the open decisions, the unfinished work
  and the verified-claims list to a file *before* the context fills, not after.
- Consider whether Domas's entry packet (which already carries decisions,
  constraints and unresolved work between sessions) should be pointed at
  ordinary project work, not only build work. That is the same problem, already
  solved once.
- This is also **article material**: post 12, "Tomorrow It Forgets Everything",
  is exactly this lesson for a general audience, and it is honest because it is
  a problem we live with rather than one we have finished solving.
