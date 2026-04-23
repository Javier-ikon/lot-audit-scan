# Ikon Lot Scan - Project Structure

This document explains the organization of the Ikon Lot Scan project.

## 📁 Directory Structure

```
ikon-lot-scan/
├── Product/              # Product Management & Documentation
│   ├── prd.md           # Product Requirements Document
│   ├── stories.md       # User stories and development tasks
│   ├── lean-canva.md    # Business model canvas
│   └── ...              # Other product docs
│
├── prototype/           # Mobile App (React Native/Expo)
│   ├── src/            # Application source code
│   ├── e2e/            # End-to-end tests
│   ├── package.json    # Dependencies
│   └── ...             # Mobile app files
│
├── design/             # Design assets and mockups
├── docs/               # General documentation
│
├── functions/          # Xano Functions (reusable logic)
├── tables/             # Xano Database Tables
├── apis/               # Xano API Endpoints
├── agents/             # Xano AI Agents
├── tasks/              # Xano Scheduled Tasks
├── tools/              # Xano Tools (for AI agents)
├── addons/             # Xano Query Addons
├── mcp_servers/        # Xano MCP Servers
├── middlewares/        # Xano Middlewares
├── realtime/           # Xano Realtime Channels
├── workflow_tests/     # Xano Workflow Tests
│
├── .xano/              # Xano Configuration
│   ├── config.json     # Workspace and path settings
│   └── branches/       # Branch-specific data
│
├── .claude/            # Claude AI Agent Definitions
├── .codex/             # Codex AI Agent Definitions
├── .cursor/            # Cursor AI Agent Definitions
└── .github/            # GitHub Actions & Agent Definitions
```

## 🎯 Key Components

### Product Documentation (`Product/`)
- **Purpose:** Product management, requirements, user stories
- **Owner:** Product Manager
- **Key Files:**
  - `prd.md` - Product Requirements Document
  - `stories.md` - Development stories and tasks
  - `lean-canva.md` - Business model

### Mobile App (`prototype/`)
- **Purpose:** React Native/Expo mobile application
- **Technology:** React Native, Expo, TypeScript
- **Key Files:**
  - `src/` - Application source code
  - `e2e/` - Playwright end-to-end tests
  - `package.json` - Dependencies

### Xano Backend (Root-level directories)
- **Purpose:** Backend-as-a-Service using Xano platform
- **Workspace:** "Audit Scanner" (ID: 147318)
- **Instance:** Free Instance (x8ki-letl-twmt)
- **Branch:** v1

**Why at root level?**
The Xano VSCode extension actively watches and manages these directories. Moving them causes the extension to auto-restore them to the root level. Keep them here for proper extension functionality.

## 🤖 AI Agent Definitions

Multiple AI coding assistants are configured with specialized agents:

- **`.claude/agents/`** - Claude AI agents (Augment)
- **`.codex/agents/`** - Codex agents
- **`.cursor/agents/`** - Cursor AI agents
- **`.github/agents/`** - GitHub Copilot agents

### Specialized Xano Agents
Each agent is an expert in a specific Xano component:

1. **xano-planner.md** - Plans and orchestrates Xano development
2. **xano-api.md** - Writes API endpoints
3. **xano-function.md** - Writes reusable functions
4. **xano-task.md** - Writes scheduled tasks
5. **xano-addon.md** - Writes database query addons
6. **xano-ai.md** - Builds AI agents and tools
7. **xano-frontend.md** - Builds static frontends
8. **xano-db.md** - Designs database schemas

## ⚠️ Important Notes

### Xano File Organization
**DO NOT** move Xano directories (`functions/`, `tables/`, `apis/`, etc.) into a subfolder. The Xano VSCode extension expects them at the root level and will automatically restore them if moved.

### Configuration
- Xano configuration is in `.xano/config.json`
- Paths are relative to the project root
- The extension watches this file and auto-syncs

## 🚀 Getting Started

### For Product Work
1. Navigate to `Product/` directory
2. Review `prd.md` for requirements
3. Check `stories.md` for current tasks

### For Mobile App Development
1. Navigate to `prototype/` directory
2. Run `npm install` to install dependencies
3. Run `npx expo start` to start development server

### For Xano Backend Development
1. Use specialized Xano agents (see `.claude/agents/xano-*.md`)
2. Files are automatically synced with Xano cloud
3. Push changes using `#tool:xano.xanoscript/push_all_changes_to_xano`

## 📚 Additional Resources

- **AGENTS.md** - Instructions for Xano development workflow
- **CLAUDE.md** - Claude-specific agent instructions
- **Product/AGENTS.md** - Product management workflow

---

**Last Updated:** 2026-03-03

