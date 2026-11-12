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

## The commands

```
/lea                         what Lea is doing in this session
/lea full <question>         answer one question in full, without the word budget
/lea-guide                   the guide: every command, every rule, how to remove Lea
```

They run only when you type them, so they add nothing to what a turn carries.

Claude Code reaches a plugin's own commands only by their full names, `/lea:lea` and
`/lea:guide`. So that the plain names work, the plugin keeps two files in your own commands
folder, `~/.claude/commands/lea.md` and `lea-guide.md`, written when a session starts - which
is why the plain names answer from the second session on, and the full names from the first.
It never overwrites a file it did not write.

## Remove

```
claude plugin uninstall lea@lea
```

Then delete `~/.claude/commands/lea.md` and `lea-guide.md`: the plugin wrote them and nothing
removes them for you.

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

No telemetry, no statusline, no second arm. The hook prints its text and exits. The two files
named above are the only things ever written to disk.
