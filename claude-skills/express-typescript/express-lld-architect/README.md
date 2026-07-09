# express-lld-architect

A Claude Code skill for low-level system design in Express.js + TypeScript.

## What this skill does

Guides Claude through selecting design patterns, applying SOLID principles, and
producing production-ready Express.js service code — controllers, services,
repositories, dependency injection, DTOs, error handling, and more.

## Requirements

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- Node.js 20+

---

## Installation

### Project-local (recommended for team repos)

```bash
mkdir -p .claude/skills
cp -R express-lld-architect .claude/skills/
```

Your project layout after install:

```
my-project/
├── .claude/
│   └── skills/
│       └── express-lld-architect/
│           ├── SKILL.md
│           ├── README.md
│           ├── references/
│           │   ├── design-patterns-guide.md
│           │   ├── solid-principles-guide.md
│           │   ├── oops-concepts.md
│           │   └── uml-diagrams.md
│           └── assets/
│               ├── express-service-template.ts
│               └── design-patterns-examples.ts
├── src/
└── package.json
```

### Global (available in every project)

```bash
mkdir -p ~/.claude/skills
cp -R express-lld-architect ~/.claude/skills/
```

### Install from GitHub

```bash
git clone https://github.com/Bishwash-007/Claude-System-Architect.git
cd Claude-System-Architect

# Global
cp -R express-lld-architect ~/.claude/skills/

# Or project-local
cp -R express-lld-architect path/to/my-project/.claude/skills/
```

---

## Verify the install

```bash
cd my-project
claude
/skills          # lists available skills — express-lld-architect should appear
```

---

## What's inside

```
express-lld-architect/
├── SKILL.md                              # Pattern tables, SOLID quick-ref, navigation
├── README.md                             # This file
├── references/
│   ├── design-patterns-guide.md          # Full TypeScript examples for every pattern
│   ├── solid-principles-guide.md         # Before/after SOLID violation examples
│   ├── oops-concepts.md                  # OOP fundamentals (abstraction → composition)
│   └── uml-diagrams.md                   # ASCII UML for class/sequence/state/etc.
└── assets/
    ├── express-service-template.ts        # Production scaffold (DI, repo, service, controller)
    └── design-patterns-examples.ts        # Runnable pattern implementations
```

The skill follows **progressive disclosure**: Claude loads `SKILL.md` first
(pattern selection tables, SOLID quick-ref), then reads individual reference or
asset files only when the task requires them — keeping context lean.

---

## Example prompts that trigger this skill

- "Design a notification service that supports email, SMS, and push"
- "Refactor this controller — it's doing too much"
- "I need dependency injection for my Express app"
- "What pattern fits an order workflow with states?"
- "Make this service testable"
- "Draw a class diagram for my user module"

---

## Updating

```bash
cd Claude-System-Architect
git pull

# Re-copy to global or project location
cp -R express-lld-architect ~/.claude/skills/
```

---

## Uninstalling

```bash
# Global
rm -rf ~/.claude/skills/express-lld-architect

# Project-local
rm -rf .claude/skills/express-lld-architect
```

---

## License

MIT
