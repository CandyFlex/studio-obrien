# cc-fleet + DeepSeek Flash Setup

One-time setup required before model routing works.

## Step 1: Install cc-fleet

PowerShell:
```powershell
irm https://raw.githubusercontent.com/ethanhq/cc-fleet/main/install.ps1 | iex
```

Verify install:
```bash
ccf --version
```

## Step 2: Register DeepSeek API Key

Run interactive TUI:
```bash
ccf
```

Navigate to: Providers → Add Provider → DeepSeek → Paste API key

Key is stored isolated from environment variables and shell history.

## Step 3: Test Delegation

```bash
ccf subagent deepseek --model fast --json --prompt "List three numbers from 1 to 100"
```

Expected: JSON response with three numbers.

## Step 4: Verify Routing Works

Open a fresh Claude Code session in this project. Opus should auto-delegate simple tasks to DeepSeek Flash per CLAUDE.md instructions.

## Troubleshooting

- `ccf: command not found` → restart shell or check PATH
- `Provider not found` → re-run `ccf` TUI and re-register DeepSeek
- API failures → check DeepSeek dashboard for quota/billing
