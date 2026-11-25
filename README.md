# Just You Need (JYN)

**Optimize your DeepSeek Harness configuration. Save tokens. Reduce noise.**

JYN is a background optimizer for [DeepSeek Harness (dsh)](https://github.com/...). It analyzes your workspace, detects your tech stack, and intelligently disables irrelevant MCPs, plugins, and skills to save context window space and API costs.

## 🚀 Quick Start (CLI)
```bash
pnpm dlx @jyn/cli analyze
```

## 🔌 dsh Plugin Installation
```bash
dsh plugin --profile web add dsh-plugin-jyn
```
## 🛠️ Development
This is a pnpm monorepo.
```bash
pnpm install
pnpm build
pnpm test
```
