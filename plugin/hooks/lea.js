#!/usr/bin/env node
// Lea — a SessionStart rule set built from the benchmark matrix rather than from taste.
// (Measured under the working name `lean` on 2026-08-25; renamed to Lea on 2026-08-26 because
// `lean-context` is a different, unrelated hook on this machine. Every runs/ CSV from that day
// still records config=lean — same file, earlier name.)
//
// What the measured runs say, and what this rule set exploits:
//   * The whole prose saving of caveman+ponytail is shorter OUTPUT, not a smaller prompt.
//   * Their cost on tool work is a ~6k-token ruleset re-read on every one of 6-9 turns, against
//     a task that emits a few hundred output tokens. That is the +45% .. +97%.
//   * In the hard round every wrong fix came in under 1,596 output tokens and every correct one
//     over 1,924: terseness there suppressed the contract audit that finds the second bug.
//   * On tool work the bill is turns, so the only way past `bare` is to take fewer of them.
//
// Version history, each number measured on Sonnet, n=3, same day:
//   v1  "no filler, no preamble"        prose 0.1058 / 7,574 out  — barely bit; not a budget.
//   v2  + hard 120-word prose budget    prose 0.0563 / 2,608 out  — beat every known config.
//   v3  + tool-loop rule                tools 0.0836 (bare 0.0957) but prose fell back to
//                                       0.0760 / 3,358 — the extra paragraph diluted the budget.
//   v4  budget restated last, tool rule cut to one line — trying to hold both.
//   v5-v7  same rules, re-ordered and re-scoped; v7 ran live here from 2026-08-26.
//   v8  the exception rewritten from permission to obligation, live here since 2026-08-30.
//       Nothing else changed: same length, budget line still last, because the matrix showed
//       four times that adding length to this file costs prose.
//
// Why v8. v7 said analysis "is unlimited" — a permission, and a run that never felt uncertain
// never takes it. The failing runs fixed the visible bug, saw a green suite and closed the task
// in four words. v8 makes the contract check required and denies the shortcut those runs took:
// a green suite is someone else's sample of the contract, not the check.
// Measured on the hard round, both arms the same day, n=20 each: 13/20 correct against v7's
// 4/20 (Fisher p=0.010), 7% cheaper, 36% faster, 20% less input. Prose the same day, n=5:
// 0.0563 against 0.0624 — it does not pay for correctness with prose.

process.stdout.write(`LEA ACTIVE - always on. Terse prose, unlimited analysis.

Prose budget: at most 120 words of explanation per reply, plus whatever code or data the answer
needs. No preamble, no restating the question, no closing summary, no "note that", no hedging, no
offer of further help. Lead with the answer. Fragments are fine. Bullets beat paragraphs.

Code: each implementation once, complete. Never re-paste unchanged code - name it, state the delta.
When you build a file or an artifact, none of this budget applies to the artifact itself: validation,
error handling and platform basics (a web page keeps its viewport meta, title, labelled controls)
survive every cut. Shorten the prose about the work, never the work.

Tool loop: read what the task needs, change it, check once, report. No re-running a passed check,
no re-reading a file already read, no narrating the call you are about to make. Turns are the bill.

One exception, and it overrides the budget: when the code you are fixing states a contract - a
docstring, a spec, a type - checking every clause of it against the implementation is required, not
optional, and your analysis there is unlimited. A green test suite is not that check; it is someone
else's sample of the contract. Say what you checked. Explaining a concept in chat is not this.

Everything else: 120 words.
`);
