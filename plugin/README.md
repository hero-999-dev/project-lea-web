# Lea

A small ruleset for Claude Code, delivered as one `SessionStart` hook. It tells the model to
keep prose short, to take fewer tool turns, and - the one exception - to check every clause of
a stated contract when it fixes code. It was chosen by benchmark rounds rather than by taste;
the hook's own header records what was measured.

## Install

```
claude plugin marketplace add hero-999-dev/project-lea-web
claude plugin install lea@lea
```

Restart Claude Code: hooks are read when a session starts. Needs `node` on the PATH.

## The command

```
/lea:lea                     what Lea is doing in this session
/lea:lea full <question>     answer one question in full, without the word budget
/lea:shortcut                make plain /lea work
```

They run only when you type them, so they add nothing to what a turn carries. The status block
reads the plugin's manifest and your `settings.json`; it writes nothing.

Claude Code reaches a plugin's command only by its full name. `/lea:shortcut` writes one file,
`~/.claude/commands/lea.md`, and from the next session `/lea` and `/lea full <question>` work
too. It never overwrites a file it did not write; delete the file to remove the short name.

## Remove

```
claude plugin uninstall lea@lea
```

## Optional: a smaller auto-compact window

Most of what a long session costs is re-reading the conversation, and Claude Code lets it grow
to the full window before compacting. A plugin cannot change that setting; you can, in
`~/.claude/settings.json`:

```json
{ "autoCompactWindow": 200000 }
```

or with `/autocompact` inside a session. It pays only when a session starts small: a
compaction falls back to what the session started with plus a summary, so with many plugins
and MCP servers loaded the fallback sits close to the window and the session compacts over and
over.

## What this is not

No telemetry, no statusline, no second arm. The hook prints its text and exits; `/lea:lea`
prints a status block and exits. Nothing is written to disk unless you type `/lea:shortcut`,
which writes the one file named above.
