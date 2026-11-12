#!/usr/bin/env node
// The user's side of Lea.
//
//   node lea-cmd.js               the status block that `/lea` shows
//   node lea-cmd.js --guide       the guide that `/lea-guide` shows: every command, every rule
//   node lea-cmd.js --auto        keep ~/.claude/commands/lea.md and lea-guide.md in place
//   node lea-cmd.js --auto-guide  the same, lea-guide.md alone (where `/lea` is something else)
//
// What the user types after a command reaches the model as text through the command file and
// never passes through a shell - a question with a quote in it would otherwise break the
// command, or run something. The only argument this script takes is one of the fixed flags above.
//
// The status block and the guide read two files and write none. `--auto` is run by the plugin's
// second SessionStart entry: Claude Code reaches a plugin's command only as `/lea:lea`, and a
// command file in the user's own folder is the one way to a plain `/lea`. It writes exactly
// those two files, never over a file it did not write, and prints NOTHING - whatever a
// SessionStart hook prints is carried by every turn, and the banner is the only thing Lea carries.
//
// The commands are user-invoked only (disable-model-invocation), so they add nothing to what a
// turn carries until someone types them.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

// Where Claude Code keeps the user's own files; CLAUDE_CONFIG_DIR moves it.
const HOME = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');

const MARK = '<!-- written by the Lea plugin; uninstalling the plugin leaves this file - delete it -->';

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    return null;
  }
}

const manifest = readJson(path.join(__dirname, '..', '.claude-plugin', 'plugin.json')) || {};
const version = manifest.version || '(version unknown)';

// The plain names exist only where the hook entry that writes them does: the lab's command-only
// copy has no hooks, and there `/lea` is something else.
const PLAIN = fs.existsSync(path.join(__dirname, '..', 'hooks', 'lea.js'));
const LEA = PLAIN ? '/lea' : '/lea:lea';

const RULES = [
  'What it asks of the model:',
  '- at most 120 words of explanation per reply; code and data are not counted',
  '- no preamble, no restating the question, no closing summary',
  '- read what the task needs, change it, check once, report',
  '- one exception: when fixing code that states a contract, every clause of it is checked',
];

function windowLine() {
  const settings = readJson(path.join(HOME, 'settings.json'));
  const win = settings && settings.autoCompactWindow;
  return win
    ? `Auto-compact window: ${win} tokens (set in your settings.json).`
    : settings
      ? 'Auto-compact window: not set. Optional - the plugin README says what it does.'
      : 'Auto-compact window: settings.json could not be read.';
}

function status() {
  const row = (name, what) => `  ${name.padEnd(32)}  ${what}`;
  return [
    `Lea ${version} is on in this session.`,
    '',
    ...RULES,
    '',
    windowLine(),
    '',
    'Commands:',
    row(LEA, 'this block'),
    row(`${LEA} full <question>`, 'answer one question in full, without the word budget'),
    row('/lea-guide', 'the guide: every command, every rule, how to remove Lea'),
    row('claude plugin uninstall lea@lea', 'remove Lea (applies to the next session)'),
  ].join('\n');
}

// Markdown, because that is what Claude Code draws: headings, bullets and code spans come out
// styled in the terminal. `head` is the one line that differs between the live guide (version,
// window) and the copy a file in the user's folder has to carry as fixed text.
function guide(head) {
  return [
    '## Lea - guide',
    '',
    head,
    '',
    '### Commands',
    '',
    `- \`${LEA}\` - status: is Lea on, which rules, which settings`,
    `- \`${LEA} full <question>\` - one answer without the word limit; the limit is back on the next reply`,
    '- `/lea-guide` - this guide',
    '',
    '### What Lea changes',
    '',
    '- **Short replies** - at most 120 words of explanation; code and data are never counted or cut',
    '- **No filler** - no preamble, no restating your question, no closing summary',
    '- **Fewer turns** - read what the task needs, change it, check once, report',
    '- **One exception** - when fixing code that states a contract (docstring, spec, type), every clause is checked, at any length',
    '',
    '### What Lea does not do',
    '',
    '- No telemetry, no network, no statusline',
    '- Never shortens the code or the files it writes - only the talk around them',
    '- Writes two files and nothing else: `~/.claude/commands/lea.md` and `lea-guide.md` (these commands)',
    '',
    '### When you want more',
    '',
    `- A long explanation once: \`${LEA} full <question>\``,
    '- A session without Lea: `claude plugin disable lea@lea`, then start a new session',
    '',
    '### Remove',
    '',
    '- `claude plugin uninstall lea@lea`',
    '- then delete `~/.claude/commands/lea.md` and `~/.claude/commands/lea-guide.md`',
  ];
}

function front(description, hint) {
  return [
    '---',
    `description: ${description}`,
    ...(hint ? [`argument-hint: "${hint}"`] : []),
    'disable-model-invocation: true',
    '---',
    '',
    MARK,
    '',
  ];
}

// The plain `/lea`. It cannot call this script - a file in the user's folder has no plugin root
// to find it by, and the plugin's own path changes with every version - so it carries its text.
function leaFile() {
  return [
    ...front('Lea - what it is doing here, or `full <question>` for one reply without the word budget',
      '[full <your question>]'),
    'The user typed `/lea` followed by this (it may be empty):',
    '',
    '<arguments>',
    '$ARGUMENTS',
    '</arguments>',
    '',
    'If the arguments start with the word `full`, what follows it is a question. For this one reply',
    'the Lea prose budget is lifted: answer that question as fully as it deserves, and show nothing',
    'from the status block. Every other Lea rule stands, and the budget is back from the next reply',
    'on. If nothing follows `full`, say that the usage is `/lea full <question>`.',
    '',
    'Otherwise show the user the status block below, in their language, and add nothing to it. If the',
    'arguments were not empty, add one line saying that they are not a Lea command.',
    '',
    '<status>',
    'Lea is on in this session.',
    '',
    ...RULES,
    '',
    'Commands:',
    '  /lea                    this block',
    '  /lea full <question>    answer one question in full, without the word budget',
    '  /lea-guide              the guide: every command, every rule, how to remove Lea',
    '</status>',
    '',
  ].join('\n');
}

function guideFile() {
  return [
    ...front('Lea guide - every command, what Lea changes, how to remove it'),
    'Show the user the guide below as it is: the same headings, the same bullets, the same code',
    'spans, in their language, with command names and paths left untranslated. Add nothing before',
    'or after it. The Lea prose budget does not apply to this reply.',
    '',
    '<guide>',
    ...guide('**Lea** is on in this session.'),
    '</guide>',
    '',
  ].join('\n');
}

function keep(name, text) {
  const dir = path.join(HOME, 'commands');
  const file = path.join(dir, name);
  let existing = null;
  try {
    existing = fs.readFileSync(file, 'utf8');
  } catch (e) {
    existing = null;
  }
  // Someone else's command stays theirs; ours is rewritten only when its text changed.
  if (existing !== null && (!existing.includes(MARK) || existing === text)) return;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, text);
  } catch (e) {
    // Silent on purpose: no plain command is a smaller fault than a line in every turn.
  }
}

const mode = process.argv[2];
if (mode === '--auto') {
  keep('lea.md', leaFile());
  keep('lea-guide.md', guideFile());
} else if (mode === '--auto-guide') {
  keep('lea-guide.md', guideFile());
} else if (mode === '--guide') {
  console.log(guide(`**Lea ${version}** is on in this session. ${windowLine()}`).join('\n'));
} else {
  console.log(status());
}
