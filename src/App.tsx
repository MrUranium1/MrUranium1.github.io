import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { projects, contributions, notes } from './content';

export default function App() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'writings'>('home');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (view === 'writings') {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-zinc-100 antialiased">
        {/* Top corner with arrow and 'Notes' in handwritten font */}
        <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-16">
          <button
            onClick={() => {
              setView('home');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-handwriting text-2xl sm:text-3xl text-zinc-300 group-hover:text-white transition-colors">
              Notes
            </span>
          </button>
        </div>

        {/* Blank minimalist page with handwritten notes */}
        <div className="max-w-2xl mx-auto px-6 pt-16 sm:pt-24 pb-32 space-y-16">
          {notes.map((note, index) => (
            <article key={index} className="space-y-4">
              {note.date && (
                <div className="font-handwriting text-xl text-zinc-500">
                  {note.date}
                </div>
              )}
              <h2 className="font-handwriting text-3xl sm:text-4xl text-zinc-100 leading-relaxed font-normal">
                {note.headline}
              </h2>
              <p className="font-handwriting text-2xl sm:text-3xl text-zinc-400 leading-relaxed">
                {note.text}
              </p>
              {index < notes.length - 1 && (
                <div className="pt-8 border-b border-zinc-900/60" />
              )}
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-zinc-100 antialiased">
      <main className="max-w-4xl mx-auto px-6 pt-20 sm:pt-28 pb-24 space-y-24">
        {/* About Section */}
        <section id="about" className="space-y-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-mono">
              mehir
            </h1>
            <p className="text-base text-zinc-300 leading-relaxed">
              Developer working with systems and open-source tooling. Writing software in{' '}
              <span className="text-zinc-100 font-medium">C</span> and{' '}
              <span className="text-zinc-100 font-medium">Python</span>, currently exploring{' '}
              <span className="text-zinc-100 font-medium">Rust</span> and{' '}
              <span className="text-zinc-100 font-medium">Ruby</span>.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Daily driver is <span className="text-zinc-200">Omarchy</span> (Arch Linux).
              Contributor to community software ecosystems and search infrastructure. Always open
              to jump into meaningful open-source projects.
            </p>
          </div>

          {/* Quick Links Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400 border-t border-zinc-900 pt-6">
            <button
              onClick={() => copyToClipboard('hossainmehir2006@gmail.com', 'email-hero')}
              className="hover:text-zinc-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>hossainmehir2006@gmail.com</span>
              {copiedKey === 'email-hero' ? (
                <Check className="w-3 h-3 text-zinc-200" />
              ) : (
                <Copy className="w-3 h-3 text-zinc-500" />
              )}
            </button>
            <span className="text-zinc-800">/</span>
            <a
              href="https://discord.com/users/1096716179785121842"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-zinc-100 transition-colors flex items-center gap-1"
            >
              <span>discord: mehir</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </a>
            <span className="text-zinc-800">/</span>
            <span>os: omarchy</span>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Projects
            </h2>
          </div>

          <div className="divide-y divide-zinc-900">
            {projects.map((project) => (
              <div key={project.title} className="py-6 space-y-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1.5 text-base font-medium text-zinc-100 hover:text-white font-mono transition-colors"
                >
                  <span className="group-hover:underline underline-offset-4">{project.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </a>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contributions / Open Source Section */}
        <section id="contributions" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Open Source Contributions
            </h2>
          </div>

          <div className="divide-y divide-zinc-900">
            {contributions.map((item) => (
              <div key={item.title} className="py-6 space-y-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1.5 text-base font-medium text-zinc-100 hover:text-white transition-colors"
                >
                  <span className="group-hover:underline underline-offset-4">{item.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </a>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Handwritten Writings Option */}
        <div className="flex items-center pt-2">
          <button
            onClick={() => {
              setView('writings');
              window.scrollTo(0, 0);
            }}
            className="font-handwriting text-2xl sm:text-3xl text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer inline-flex items-center gap-2.5 group"
            title="Read personal notes"
          >
            <span>writings</span>
            <span className="text-zinc-600 group-hover:text-zinc-300 text-lg transition-transform group-hover:translate-x-1 font-sans">
              →
            </span>
          </button>
        </div>

        {/* Technical Stack Section */}
        <section id="stack" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex items-baseline justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Languages & Environment
            </h2>
            <span className="text-xs font-mono text-zinc-600">arsenal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 rounded border border-zinc-900 bg-zinc-950/40 space-y-2">
              <div className="text-zinc-400">Known</div>
              <div className="text-sm font-semibold text-zinc-100">C, Python, HTML</div>
              <p className="text-zinc-400 font-sans leading-relaxed text-xs pt-1">
                Core languages for low-level systems, automation scripts, and web structure.
              </p>
            </div>

            <div className="p-4 rounded border border-zinc-900 bg-zinc-950/40 space-y-2">
              <div className="text-zinc-400">Learning</div>
              <div className="text-sm font-semibold text-zinc-100">Rust, Ruby</div>
              <p className="text-zinc-400 font-sans leading-relaxed text-xs pt-1">
                Exploring memory-safe concurrent systems in Rust and expressive scripting in Ruby.
              </p>
            </div>

            <div className="p-4 rounded border border-zinc-900 bg-zinc-950/40 space-y-2">
              <div className="text-zinc-400">Environment</div>
              <div className="text-sm font-semibold text-zinc-100">Omarchy</div>
              <p className="text-zinc-400 font-sans leading-relaxed text-xs pt-1">
                Arch Linux daily driver configured for minimal overhead and keyboard-first workflows.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Coordinates */}
        <section id="contact" className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Coordinates
            </h2>
          </div>

          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-xl font-sans">
            Happy to contribute to open source projects and help if you need a hand.
          </p>

          {/* Pure Clickable Logos Side by Side */}
          <div className="flex items-center gap-8 pt-2">
            {/* GitHub */}
            <a
              href="https://github.com/MrUranium1"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              title="GitHub"
              className="opacity-75 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
            >
              <svg className="w-7 h-7 fill-white shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Discord */}
            <a
              href="https://discord.com/users/1096716179785121842"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Discord"
              title="Discord"
              className="opacity-75 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
            >
              <svg className="w-7 h-7 fill-[#5865F2] shrink-0" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.893.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/rusthatesmarty"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Twitter / X"
              title="Twitter / X"
              className="opacity-75 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
            >
              <svg className="w-7 h-7 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/rusthatesmarty"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              title="Instagram"
              className="opacity-75 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
            >
              <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="igOnlyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="url(#igOnlyGrad)" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="url(#igOnlyGrad)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="url(#igOnlyGrad)" />
              </svg>
            </a>

            {/* Email / Gmail */}
            <a
              href="mailto:hossainmehir2006@gmail.com"
              aria-label="Email"
              title="Email"
              className="opacity-75 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
            >
              <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22 6c0-.55-.45-1-1-1h-2L12 12 5 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h2v-9l7 5.5 7-5.5v9h2c.55 0 1-.45 1-1V6z" />
                <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 py-10 text-xs font-mono text-zinc-400">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <span>mehir.is-a.dev</span>
          <span>omarchy / arch linux</span>
        </div>
      </footer>
    </div>
  );
}
