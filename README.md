# Mehir

> Systems, tools, and open source.

- **Stack**: C, Python, HTML
- **Exploring**: Rust, Ruby
- **OS**: Omarchy (Arch Linux)
- **Web**: [mehir.is-a.dev](https://mehir.is-a.dev)
- **GitHub**: [@MrUranium1](https://github.com/MrUranium1)
- **Discord**: [mehir (1096716179785121842)](https://discord.com/users/1096716179785121842)
- **Twitter / X**: [@rusthatesmarty](https://x.com/rusthatesmarty)
- **Instagram**: [@rusthatesmarty](https://www.instagram.com/rusthatesmarty)
- **Email**: [hossainmehir2006@gmail.com](mailto:hossainmehir2006@gmail.com)

---

### Projects

- [**Omanet**](https://github.com/MrUranium1/Omanet) — Native Omarchy plugin for controlling Android USB reverse tethering through GNirehtet with top-bar controls.
- [**Omarchy-Tide-Island**](https://github.com/MrUranium1/Omarchy-Tide-Island) — Tide Island integration for Omarchy with theme/wallpaper picking, shortcuts, and desktop OSD.
- [**Local_Chess**](https://github.com/MrUranium1/Local_Chess) — Peer-to-peer multiplayer chess played over Bluetooth or local Wi-Fi without internet.

---

### Open Source Contributions

- [**Omarchy Plugin Marketplace**](https://github.com/omacom/omarchy-plugin-marketplace) — Plugin distribution, packaging specs, and ecosystem tooling for Omarchy.
- [**Xerj AI Search Engine**](https://github.com/xerj-org/xerj) — Query ingestion and indexing pipelines.

*Happy to contribute to open source projects. Reach out if you need a hand.*

---

### Adding New Projects & Notes
All projects, contributions, and handwritten notes are stored in **`src/content.ts`**.
To add a new project or note, simply open `src/content.ts` and add your entry to the list. The website will automatically render it with consistent fonts, links, and styling.

---

### Deploying to GitHub Pages

This repository is pre-configured for GitHub Pages:

#### Option 1: Automatic Deployment with GitHub Actions (Recommended)
1. Push this repository to GitHub.
2. In your GitHub repo, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every time you push to `main` (or `master`), GitHub Actions (`.github/workflows/deploy.yml`) will automatically build and deploy your site!

#### Option 2: Manual Deploy via CLI
You can also build and deploy directly to the `gh-pages` branch with one command:
```bash
npm run deploy
```
This runs `npm run build` and pushes the `dist` folder to your repo's `gh-pages` branch.

