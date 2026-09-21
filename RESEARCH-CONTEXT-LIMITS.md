# Research: what actually happens as volume grows

Compiled 21 September 2026 for the homepage section "Why Not Just Ask Claude Or
ChatGPT?". Every number on that section traces to something here. Do not change
a figure on the site without changing this file, and do not restate a figure
from memory.

---

## 1. Everything shares the window, and your files are not held in it

**Source:** Anthropic, Claude Platform docs, "Context windows".
https://platform.claude.com/docs/en/build-with-claude/context-windows

> "Everything in the request counts toward the context window: the system
> prompt, every message in `messages` (including tool results, images, and
> documents), and your tool definitions. The output Claude generates for the
> turn, including its extended thinking, counts too."

> "As token count grows, accuracy and recall degrade, a phenomenon known as
> *context rot*. This makes curating what's in context just as important as how
> much space is available."

Also from the same page: compaction "automatically summarizes earlier parts of
the conversation on the server, so the conversation can continue past the
context window limit", and context editing exists to clear "old tool results"
and thinking blocks.

**Supports on the site:** the point that the quoted window size is never usable
capacity, and the "Compaction" card.

---

## 2. Why it degrades: the attention budget

**Source:** Anthropic engineering, "Effective context engineering for AI
agents", 29 September 2025.
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

> "LLMs have an 'attention budget' that they draw on when parsing large volumes
> of context."

> "as the number of tokens in the context window increases, the model's ability
> to accurately recall information from that context decreases"

Mechanism, in their words: transformers give "n² pairwise relationships for n
tokens", so as context expands "a model's ability to capture these pairwise
relationships gets stretched thin", and models have "less experience with, and
fewer specialized parameters for, context-wide dependencies".

Important qualifier to keep us honest: they describe "a performance gradient
rather than a hard cliff: models remain highly capable at longer contexts but
may show reduced precision for information retrieval and long-range reasoning."

**Supports on the site:** that this is a known property, not our opinion. Also
why we must not claim a cliff or a single threshold.

---

## 3. How early it starts: NoLiMa

**Source:** Modarressi et al., "NoLiMa: Long-Context Evaluation Beyond Literal
Matching", ICML 2025. https://arxiv.org/abs/2502.05167

From the abstract, quoted exactly:

> "We evaluate 13 popular LLMs that claim to support contexts of at least 128K
> tokens."

> "At 32K, for instance, 11 models drop below 50% of their strong short-length
> baselines."

> "Even GPT-4o, one of the top-performing exceptions, experiences a reduction
> from an almost-perfect baseline of 99.3% to 69.7%."

The benchmark uses "a carefully designed needle set, where questions and
needles have minimal lexical overlap, requiring models to infer latent
associations to locate the needle within the haystack."

**Why this one matters most to us.** Minimal lexical overlap is exactly our
reversal case: "forget that, the client won't wear it" shares no words with
"what did we agree on payment terms?". NoLiMa is the published version of the
failure we describe in field note 05.

**Supports on the site:** the 20,000 words figure, and the "It can miss what
you changed" card.

---

## 4. It is not one model or one benchmark: Chroma

**Source:** Chroma, "Context Rot: How Increasing Input Tokens Impacts LLM
Performance", 14 July 2025. https://www.trychroma.com/research/context-rot

18 models across Anthropic, OpenAI, Google and Alibaba. Task difficulty held
constant while input length varied. Findings we rely on:

- Performance declined as input length grew, across all 18 models.
- Low similarity between question and target degraded faster than high
  similarity. Same finding as NoLiMa, different method.
- A single distractor hurt; four compounded it.
- LongMemEval: large gap between a focused ~300 token prompt and the full
  ~113k token prompt, on the same question. Claude Opus 4 showed the largest
  gap. The gap persisted with thinking enabled.

**Supports on the site:** that degradation is general rather than a quirk of
one vendor, and that the same question answered from a focused input beats the
same question answered from the whole pile.

---

## 5. Why it fills gaps rather than saying it does not know

**Source:** Kalai, Nachum, Vempala and Zhang, "Why Language Models
Hallucinate", OpenAI, September 2025. https://arxiv.org/abs/2509.04664 and
https://openai.com/index/why-language-models-hallucinate/

The argument: training and evaluation reward guessing over admitting
uncertainty, in the way an exam rewards a guess over a blank. Models are
optimised to be good test takers, and a confident wrong answer scores better
than "I do not know". They also show generation is harder than classification,
so a model can often tell a false statement from a true one yet still produce
falsehoods when asked to generate.

**Supports on the site:** the "Hallucination" card, and specifically Daniel's
framing that it is not lying for its own sake. It fills the gap because filling
the gap is what it was rewarded for.

---

## 6. Claiming work it did not do

**Source:** the reward hacking literature, e.g. "Reward Hacking Benchmark:
Measuring Exploits in LLM Agents with Tool Use", https://arxiv.org/abs/2605.02964

Documented behaviours include "forging 'completion' markers, fabricating
intermediate artifacts with plausible structure, skipping mandated verification
steps, or directly emitting a final report without generating prerequisite
files".

**Supports on the site:** the "It says it read everything" card. Note that our
card is written as our own incident, which is the stronger form. This citation
exists so we can answer a sceptic, not to put on the page.

---

## 7. Our own measurement

Taken 21 September 2026 from the Claude Code session that wrote the homepage
section, as the session reported its own window:

| Category | Tokens |
|---|---|
| Context window | 1,000,000 |
| System prompt | 5,981 |
| System tools | 23,689 |
| MCP tools | 19,646 |
| Skills | 9,925 |
| Custom agents | 1,397 |
| **Overhead before any of our material** | **60,638** |
| Messages, i.e. the conversation itself | 145,974 |
| **Total in use** | **206,636 (21%)** |

The messages figure is **after** the session had been compacted about an hour
earlier. Everything before that point had already been summarised and dropped.

Caveat that must stay on the page: this is a working setup with tools and MCP
servers connected. A plain chat window starts far smaller.

---

## Tokens to words

Anthropic's own glossary: "For Claude, a token approximately represents 3.5
English characters."
https://platform.claude.com/docs/en/about-claude/glossary

English words average about 4.7 letters, so roughly 5.7 characters with the
space. That gives about 0.61 words per token, and we round down rather than up:

| Tokens | Words used on the site |
|---|---|
| 1,000,000 | ~600,000 |
| 145,974 | ~90,000 |
| 60,638 | ~37,000 |
| 32,000 (NoLiMa) | ~20,000 |

The common "0.75 words per token" rule of thumb would give 750,000 for the
window. We publish the lower, Anthropic-derived figure. Understating our own
headline number costs nothing and cannot be argued with.

---

## What we must not claim

- **No single threshold.** Anthropic call it "a performance gradient rather
  than a hard cliff". Do not write "it breaks at X words".
- **No claim about a specific product's overhead.** We measured our own
  session, not ChatGPT's or claude.ai's.
- **No claim that the models cannot do something** where the honest claim is
  that they will not do it unaided. This was the repeated correction of 21
  September.
- **Nothing about internal mechanisms** we have not read a primary source for.
