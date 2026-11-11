#!/usr/bin/env node
// The user's side of Lea: the status block that `/lea` shows.
//
// It takes no arguments on purpose. What the user types after `/lea` reaches the model as text
// through the command file and never passes through a shell - a question with a quote in it
// would otherwise break the command, or run something.
//
// It reads two files and writes none. The command is user-invoked only (the command file says
// disable-model-invocation), so it adds nothing to what a turn carries until someone types it.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    return null;
  }
}

const manifest = readJson(path.join(__dirname, '..', '.claude-plugin', 'plugin.json')) || {};
const settings = readJson(path.join(os.homedir(), '.claude', 'settings.json'));
const win = settings && settings.autoCompactWindow;

console.log([
  `Lea ${manifest.version || '(version unknown)'} is on in this session.`,
  '',
  'What it asks of the model:',
  '- at most 120 words of explanation per reply; code and data are not counted',
  '- no preamble, no restating the question, no closing summary',
  '- read what the task needs, change it, check once, report',
  '- one exception: when fixing code that states a contract, every clause of it is checked',
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
  '  claude plugin uninstall lea@lea   remove Lea (applies to the next session)',
].join('\n'));
