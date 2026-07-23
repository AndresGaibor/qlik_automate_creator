# Model Routing Budget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance OpenCode agents so Terra is reserved for planning, Luna orchestrates, and MiniMax/Mini handle frequent execution work.

**Architecture:** Keep one active `custom` preset in `oh-my-opencode-slim.json`. Use fixed role-based routing because OpenCode does not currently provide native round-robin routing across different models. Keep Oracle without a model so Sol is never selected automatically.

**Tech Stack:** OpenCode JSON configuration, `oh-my-opencode-slim` preset configuration.

## Global Constraints

- Do not use `openai/gpt-5.6-sol` automatically.
- Prefer `minimax/MiniMax-M2.7`, `openai/gpt-5.4-mini`, and free Zen models for frequent work.
- Keep `openai/gpt-5.6-terra` for planning only.
- Use `opencode/big-pickle` only after OpenCode Zen is connected.
- Do not add dependencies or a custom router.

---

### Task 1: Apply role-based model routing

**Files:**
- Modify: `/Users/andresgaibor/.config/opencode/oh-my-opencode-slim.json`
- Modify: `/Users/andresgaibor/.config/opencode/opencode.json`

**Interfaces:**
- Consumes: Existing `custom` preset and native `plan`/`build` agent configuration.
- Produces: Terra for planning, Luna for orchestration/design, MiniMax for execution/research, Mini for exploration/fixes, and Big Pickle for small tasks.

- [x] **Step 1: Update the custom preset**

Set these models:

```json
{
  "orchestrator": "openai/gpt-5.6-luna",
  "oracle": {},
  "librarian": "minimax/MiniMax-M2.7",
  "explorer": "openai/gpt-5.4-mini",
  "designer": "openai/gpt-5.6-luna",
  "fixer": "minimax/MiniMax-M2.7",
  "small": "opencode/big-pickle"
}
```

- [x] **Step 2: Update native agents**

Set `agent.plan.model` to `openai/gpt-5.6-terra`, keep `agent.build.model` as `minimax/MiniMax-M2.7`, set the global `model` to `openai/gpt-5.6-luna`, and set `small_model` to `openai/gpt-5.4-mini`.

- [x] **Step 3: Validate configuration**

Run:

```bash
opencode models
opencode debug config
```

Expected: no `oh-my-opencode-slim` validation error; the configured providers and models resolve without selecting Sol.
