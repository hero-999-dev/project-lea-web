---
description: Show what Lea is doing in this session, or lift its word budget for one reply
argument-hint: "[full <your question>]"
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

The user typed `/lea:lea` followed by this (it may be empty):

<arguments>
$ARGUMENTS
</arguments>

If the arguments start with the word `full`, what follows it is a question. For this one reply
the Lea prose budget is lifted: answer that question as fully as it deserves, and show nothing
from the status block. Every other Lea rule stands, and the budget is back from the next reply
on. If nothing follows `full`, say that the usage is `/lea:lea full <question>`.

Otherwise show the user the status block below, in their language, and add nothing to it. If the
arguments were not empty, add one line saying that they are not a Lea command.

<status>
!`node "${CLAUDE_PLUGIN_ROOT}/scripts/lea-cmd.js"`
</status>
