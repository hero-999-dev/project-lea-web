# project-lea-web

**Lea** — a 226-word SessionStart hook for Claude Code, designed from benchmark
data — with the reports, the install guides and the source, behind a password
gate.

**https://hero-999-dev.github.io/project-lea-web/**

## What is here

Everything. The source repository is private, so this mirror has to stand on
its own, and it does:

| | |
|---|---|
| The ruleset and why each rule is there | `rapor-lea.html` |
| Four benchmark rounds, five configs, Sonnet and Opus | `rapor.html`, `rapor-model-karsilastirma.html` |
| The real-repository round | `rapor-opus-proje-turu.html` |
| What Lea has saved, and what proving it cost | `rapor-tasarruf.html` |
| The shadow arm | `rapor-golge.html` |
| v9: tried, did not pass | `rapor-v9.html` |
| All of it as one page | `tek-dosya.html`, and `RAPOR.md` for a plain reader |
| Install, EN and TR | `install.html`, `kurulum.html` |
| The collector | `collector.html`, `collector.tr.html` |
| **The hook, the config and the collector, to download** | `Project-Lea.zip` |

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

The pages that used to link to the repository now link to the copies here, and
`git clone` is replaced by the zip.
