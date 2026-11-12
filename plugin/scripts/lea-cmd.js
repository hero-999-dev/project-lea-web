#!/usr/bin/env node
// The user's side of Lea.
//
//   node lea-cmd.js              the status block that `/lea:lea` shows
//   node lea-cmd.js --shortcut   write ~/.claude/commands/lea.md, so that plain `/lea` works
//
// What the user types after a command reaches the model as text through the command file and
// never passes through a shell - a question with a quote in it would otherwise break the
// command, or run something. The only argument this script takes is the fixed flag above.
//
// The status block reads two files and writes none. `--shortcut` writes exactly one file, only
// when the user asks for it by typing `/lea:shortcut`, and never over a file it did not write:
// Claude Code reaches a plugin's command only as `/lea:lea`, and a command file in the user's
// own folder is the one way to a plain `/lea`.
//
// Both commands are user-invoked only (disable-model-invocation), so they add nothing to what a
// turn carries until someone types them.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const MARK = '<!-- written by the Lea plugin (/lea:shortcut); delete this file to remove /lea -->';

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    return null;
  }
}

const manifest = readJson(path.join(__dirname, '..', '.claude-plugin', 'plugin.json')) || {};
const version = manifest.version || '(version unknown)';

const RULES = [
  'What it asks of the model:',
  '- at most 120 words of explanation per reply; code and data are not counted',
  '- no preamble, no restating the question, no closing summary',
  '- read what the task needs, change it, check once, report',
  '- one exception: when fixing code that states a contract, every clause of it is checked',
];

function status() {
  const settings = readJson(path.join(os.homedir(), '.claude', 'settings.json'));
  const win = settings && settings.autoCompactWindow;
  return [
    `Lea ${version} is on in this session.`,
    '',
    ...RULES,
    '',
    win
      ? `Auto-compact window: ${win} tokens (set in your settings.json).`
      : settings
        ? 'Auto-compact window: not set. Optional - the plugin README says what it does.'
        : 'Auto-compact window: settings.json could not be read.',
    '',
    'Commands:',
    '  /lea:lea                          this block',
    '  /lea:lea full <question>          answer one question in full, without the word budget',
    // Listed only where it is installed: the lab's command-only copy leaves it out.
    ...(fs.existsSync(path.join(__dirname, '..', 'commands', 'shortcut.md'))
      ? ['  /lea:shortcut                     make plain /lea work (writes one file in ~/.claude/commands)']
      : []),
    '  claude plugin uninstall lea@lea   remove Lea (applies to the next session)',
  ].join('\n');
}

// The plain `/lea`. It cannot call this script - a file in the user's folder has no plugin root
// to find it by, and the plugin's own path changes with every version - so it carries its text.
function shortcutFile() {
  return [
    '---',
    'description: Lea - what it is doing here, or `full <question>` for one reply without the word budget',
    'argument-hint: "[full <your question>]"',
    'disable-model-invocation: true',
    '---',
    '',
    MARK,
    '',
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
    '  /lea:lea                the same, with the version and the auto-compact window',
    '</status>',
    '',
  ].join('\n');
}

function shortcut() {
  const dir = path.join(os.homedir(), '.claude', 'commands');
  const file = path.join(dir, 'lea.md');
  let existing = null;
  try {
    existing = fs.readFileSync(file, 'utf8');
  } catch (e) {
    existing = null;
  }
  if (existing !== null && !existing.includes(MARK)) {
    return `Tell the user, in their language: ${file} already exists and was not written by Lea, ` +
      'so it was left alone and plain /lea was not set up.';
  }
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, shortcutFile());
  } catch (e) {
    return `Tell the user, in their language: ${file} could not be written (${e.code || e.message}).`;
  }
  return 'Tell the user, in their language, and add nothing: plain /lea is set up. One file was ' +
    `written: ${file}. It works from the next session; deleting that file removes it. ` +
    'If a skill or command named lea already exists on this machine, that one answers /lea instead.';
}

console.log(process.argv[2] === '--shortcut' ? shortcut() : status());
