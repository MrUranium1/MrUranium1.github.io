// ✏️ Edit this file to change your site. No need to touch index.html.
window.SITE = {
  name: "Mehir",
  domain: "mehir.is-a.dev",            // change if you register a different subdomain

  rolePrefix: "I’m a",                 // text before the typing words
  roles: ["developer", "Linux tinkerer", "plugin builder", "student"],

  bio: "I build small, useful tools for Linux and Android, from Omarchy plugins to offline multiplayer games.",

  // About section (delete "about" and "stack" to hide it)
  about: "I like making things that fit right into how people already work: a bar widget, a one-key toggle, a game you can play with no internet.",
  stack: {
    Languages: "Kotlin, Bash, QML",
    Android:   "Jetpack Compose, Room, Bluetooth, Wi-Fi sockets",
    Linux:     "Omarchy, Hyprland, Quickshell, systemd",
    Tools:     "Git, GitHub Actions, Android Studio"
  },

  // My work: add, remove or reorder. Delete the whole list to hide the section.
  works: [
    {
      title: "Omarchy Tide Island",
      desc: "Swaps the Omarchy bar for a Dynamic-Island-style overlay with one keypress, plus wallpaper and theme pickers.",
      tags: ["Omarchy", "Quickshell", "QML", "Bash"],
      url: "https://github.com/MrUranium1/Omarchy-Tide-Island"
    },
    {
      title: "OmaNet",
      desc: "Omarchy bar plugin that shares your laptop’s internet with an Android phone over USB, using GNirehtet and systemd.",
      tags: ["Omarchy", "GNirehtet", "systemd", "Bash"],
      url: "https://github.com/MrUranium1/Omanet"
    },
    {
      title: "Local Chess",
      desc: "Android chess you can play with nearby friends over Bluetooth or local Wi-Fi, with an offline AI, timers and board themes.",
      tags: ["Kotlin", "Jetpack Compose", "Bluetooth", "Room"],
      url: "https://github.com/MrUranium1/Local_Chess"
    }
  ],

  // What you’re up to lately (delete the list to hide it)
  now: [
    "Building Omarchy plugins",
    "Polishing Local Chess",
    "Setting up this site"
  ],

  // Add, remove or reorder links freely. Use "mailto:" for email.
  links: [
    { label: "GitHub",   url: "https://github.com/MrUranium1" },
    { label: "Email",    url: "mailto:hossainmehir2006@gmail.com" },
    { label: "X",        url: "https://x.com/rusthatesmarty" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/sahariar-hossain-mehir-b89178398/" }
  ],

  // Language pages (folders next to index.html)
  langs: [
    { label: "Rust",   url: "rust/" },
    { label: "Ruby",   url: "ruby/" },
    { label: "Python", url: "python/" },
    { label: "Java",   url: "java/" },
    { label: "C",      url: "c/" }
  ],

  // Footer clock
  city: "Dhaka",
  timezone: "Asia/Dhaka",             // any IANA timezone, e.g. "America/New_York"

  theme: "auto"                        // "auto" (follows system), "dark" or "light"
};
