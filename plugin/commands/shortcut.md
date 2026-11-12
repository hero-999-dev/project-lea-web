---
description: Make plain /lea work - writes one command file into your ~/.claude/commands
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/lea-cmd.js" --shortcut`
