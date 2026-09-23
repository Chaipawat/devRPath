import type { CSSProperties } from "react";

const WORDS = [
  "const", "let", "=>", "async", "await", "return", "import", "export", "function()", "<div>", "</>", "{ }",
  "useState", "useEffect", "props", "JSX", "TypeScript", "JavaScript", "Python", "Java", "Go", "Rust", "SQL",
  "HTML", "CSS", "Node.js", "React", "Next.js", "Docker", "K8s", "git push", "git merge", "npm i", "SELECT *",
  "JOIN", "JSON", "REST", "GraphQL", "HTTP 200", "404", "JWT", "OAuth", "Redis", "CI/CD", "O(n)", "O(log n)",
  "null", "undefined", "true", "class", "interface", "try { }", "catch (e)", "console.log()", "fetch()", "Promise",
  ".map()", ".filter()", "SOLID", "cache", "queue", "λ", "#!/bin/bash", "localhost:3000", "@Controller",
  "def main():", "fn main()", "pip install", "kubectl", "yaml", "Spring Boot", "WebSocket", "mutex", "0x1F",
];

// Tiny deterministic PRNG so server and client render identical positions.
function random(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

type Props = { count?: number; seed?: number; tone?: "light" | "dark"; className?: string };

export function FloatingKeywords({ count = 42, seed = 7, tone = "light", className = "" }: Props) {
  const rand = random(seed);
  const cols = 7;
  const rows = Math.ceil(count / cols);
  const words = Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const accent = rand();
    const big = rand() > 0.86;
    return {
      text: WORDS[Math.floor(rand() * WORDS.length)],
      style: {
        left: `${(((col + 0.1 + rand() * 0.8) / cols) * 100).toFixed(2)}%`,
        top: `${(((row + 0.1 + rand() * 0.8) / rows) * 100).toFixed(2)}%`,
        "--size": `${big ? 15 + Math.round(rand() * 5) : 10 + Math.round(rand() * 3)}px`,
        "--alpha": (big ? 0.12 + rand() * 0.08 : 0.2 + rand() * 0.22).toFixed(2),
        "--dx": `${Math.round((rand() - 0.5) * 36)}px`,
        "--dy": `${-12 - Math.round(rand() * 26)}px`,
        "--dur": `${(9 + rand() * 10).toFixed(1)}s`,
        "--delay": `${(-rand() * 18).toFixed(1)}s`,
      } as CSSProperties,
      accent: accent > 0.86 ? "is-signal" : accent > 0.74 ? "is-electric" : "",
    };
  });

  return (
    <div className={`floating-keywords tone-${tone} ${className}`} aria-hidden="true">
      {words.map((word, i) => <span key={i} className={word.accent} style={word.style}>{word.text}</span>)}
    </div>
  );
}
