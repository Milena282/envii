import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-12 border-t border-zinc-800">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-sm">
              E
            </div>
            <span className="text-xl font-semibold text-white font-mono">
              envii
            </span>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="https://github.com/akinloluwami/envii"
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Docs
            </a>
            <div className="w-px h-4 bg-zinc-800" />
            <a
              href="https://github.com/akinloluwami/envii"
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              GitHub
            </a>
            <div className="w-px h-4 bg-zinc-800" />
            <a
              href="https://npmjs.com/package/envii-cli"
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              npm
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/akinloluwami/envii"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/aaborisade_"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <p className="font-mono">
            © {new Date().getFullYear()} envii — MIT License
          </p>
          <p>
            Built for developers who value their secrets
            <span className="text-emerald-500 ml-1">_</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
