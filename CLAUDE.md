# tmad4000.github.io - Jacob Cole's Personal Site

GitHub Pages site at https://tmad4000.github.io

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Main homepage |
| `brainstorms/` | Idea List - half-baked thoughts worth sharing |
| `chats.html` | Deep AI conversation excerpts |
| `prompts.html` | Interesting AI prompts and outputs |
| `piano-duet/` | Piano with AI accompaniment project |

## Conventions

### External Links
- All external links should open in new tabs (`target="_blank" rel="noopener"`)
- The markdown viewer (`brainstorms/view.html`) handles this automatically for rendered content
- For HTML files, add these attributes manually

### Brainstorms / Idea List
- Folder is `brainstorms/` but displayed as "Idea List" to avoid confusion with Claude Mind's Research Idea Bank
- Use `view.html?f=filename.md` to render markdown files nicely
- Each idea should have a source attribution (e.g., Thoughtstream note ID)

### Naming
- **Idea List** = Jacob's personal ideas (`brainstorms/`)
- **Research Idea Bank** = Claude Mind's AI-discovered research opportunities (separate repo)

## Deployment
- Automatically deployed via GitHub Pages on push to main
- No build step required - static HTML/CSS/JS only
