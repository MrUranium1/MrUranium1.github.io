// =============================================================================
// PORTFOLIO CONTENT DATA
// =============================================================================
// To add or modify projects, contributions, or notes, just update this file!
// You do not need to touch any HTML, React, or styling code.
// =============================================================================

export interface ProjectItem {
  title: string;
  url: string;
  description: string;
}

export interface ContributionItem {
  title: string;
  url: string;
  description: string;
}

export interface NoteItem {
  headline: string;
  text: string;
  date?: string; // Optional (e.g. "Oct 2026")
}

// -----------------------------------------------------------------------------
// 1. PROJECTS (Shown on homepage under "Projects")
// -----------------------------------------------------------------------------
export const projects: ProjectItem[] = [
  {
    title: "Omanet",
    url: "https://github.com/MrUranium1/Omanet",
    description:
      "Native Omarchy plugin for controlling Android USB reverse tethering through GNirehtet, featuring top-bar controls and systemd service integration.",
  },
  {
    title: "Omarchy-Tide-Island",
    url: "https://github.com/MrUranium1/Omarchy-Tide-Island",
    description:
      "Tide Island integration for Omarchy with native theme and wallpaper picking, configurable shortcuts, and desktop OSD / notification integration.",
  },
  {
    title: "Local_Chess",
    url: "https://github.com/MrUranium1/Local_Chess",
    description:
      "Play chess with friends nearby with no internet required. Connect over Bluetooth or local Wi-Fi for real-time peer-to-peer multiplayer chess matches.",
  },
];

// -----------------------------------------------------------------------------
// 2. OPEN SOURCE CONTRIBUTIONS (Shown on homepage under "Open Source Contributions")
// -----------------------------------------------------------------------------
export const contributions: ContributionItem[] = [
  {
    title: "Omarchy Plugin Marketplace",
    url: "https://github.com/omacom/omarchy-plugin-marketplace",
    description:
      "Contributed to the plugin marketplace ecosystem for Omarchy users. Worked on repository indexing, package validation rules, and streamlined installation tooling for customized Arch environments.",
  },
  {
    title: "Xerj AI Search Engine",
    url: "https://github.com/xerj-org/xerj",
    description:
      "Contributed to query ingestion and indexing routines for the Xerj search engine. Assisted in processing pipeline handlers and performance improvements for data fetching.",
  },
];

// -----------------------------------------------------------------------------
// 3. WRITINGS / NOTES (Shown on the handwritten "Notes" page)
// -----------------------------------------------------------------------------
// Any note you add here will automatically appear on the Notes page with the
// exact same handwritten font style and spacing!
// -----------------------------------------------------------------------------
export const notes: NoteItem[] = [
  {
    headline: "i build & develop for hobby.",
    text: "tinkering with low-level systems, writing C and Python, learning Rust, and daily driving Arch Linux on Omarchy — just the pure craft without the noise.",
  },
];
