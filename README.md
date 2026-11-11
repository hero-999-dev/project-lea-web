# project-lea-web

**Lea** — a 226-word SessionStart hook for Claude Code, designed from benchmark
data — told on one page, behind a password gate, and installable as a plugin.

**https://hero-999-dev.github.io/project-lea-web/**

## What is here

One page, in Turkish and in English: what Lea is, what it tells the model word
for word, how to install it, what it has saved, the timeline of the project and
every result table. And the plugin itself, in `plugin/`.

The detailed reports, the install guides and the source archive are no longer
published here (since 2026-11-11). They live in the private source repository;
the page is their revised summary.

## The gate

`index.html` asks for a password and derives
`p-<sha256("lea:<password>")[:20]>/` in the browser. Neither the password nor
the directory name is in the page source; a wrong password requests a directory
that does not exist.

It locks the **link**, not the content. This repository is public, so anyone
browsing it sees the directory. The gate stops a URL from travelling further
than it was handed; it is not secrecy, and nothing that would be a problem to
read is behind it. No user names, no machine names, no absolute paths with an
account in them, no credentials.

## Moved from Project-Lea

This replaces `https://hero-999-dev.github.io/Project-Lea/`, which stopped
working when that repository became private — GitHub Pages does not serve from
a private repository on a free account. The gate directory was renamed on 2026-09-06 to match the password this
account actually uses everywhere, so an older gate link no longer resolves; the
gate page itself is unchanged.

<!-- plugin:begin -->
## Install Lea as a Claude Code plugin

```
claude plugin marketplace add hero-999-dev/project-lea-web
claude plugin install lea@lea
```

That adds one `SessionStart` hook and one command you type (`/lea:lea`) - see `plugin/README.md`. No password is
needed: the plugin sits outside the gate.
<!-- plugin:end -->
