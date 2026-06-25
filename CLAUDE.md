@AGENTS.md

# Skills

Active skills — invoke automatically when task matches trigger.

## Ponytail (anti-overbuild)

**Level:** full | **Trigger:** any code task

1. Does it need to exist? → skip
2. Stdlib/native covers it? → use it
3. Already-installed dep? → use it
4. One-liner? → one line
5. Only then → minimum code

Skip: unrequested abstractions, scaffolding "for later", boilerplate.
Pattern: `[code] → skipped: [X], add when [Y].`

## Caveman (terse output)

**Trigger:** every response once activated

Drop filler, articles, pleasantries. Fragments OK. Technical terms exact.
Pattern: `[thing] [action] [reason].`

## Headroom (context compression)

**Trigger:** large file reads, big tool outputs, RAG chunks, logs

MCP tools available: `headroom_compress`, `headroom_retrieve`, `headroom_stats`.
Use when tool outputs exceed ~2k tokens or reading large files. Compress before reasoning.
Start proxy if needed: `headroom proxy`.
