import type { BookSection } from "@/lib/content";

export function SectionIcon({ kind }: { kind: BookSection["kind"] }) {
  const common = { fill: "none", stroke: "#1F2937", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg aria-hidden="true" viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#EEF6F3" />
    {kind === "foundation" && <g {...common}><path fill="#F4B393" d="M14 26h17v11H14zM33 26h17v11H33zM23 39h18v11H23z" /><path d="M14 26h17v11H14zM33 26h17v11H33zM23 39h18v11H23z" /></g>}
    {kind === "frontend" && <g {...common}><rect x="13" y="17" width="38" height="30" rx="4" fill="#9CC5E0" /><path d="M13 25h38M19 21h.1M24 21h.1M29 21h.1M22 34h20M22 39h13" /></g>}
    {kind === "backend" && <g {...common}><circle cx="32" cy="32" r="9" fill="#F4B393" /><circle cx="32" cy="32" r="3" /><path d="M32 15v6M32 43v6M15 32h6M43 32h6M20 20l4 4M40 40l4 4M44 20l-4 4M24 40l-4 4" /></g>}
    {kind === "infrastructure" && <g {...common}><path fill="#9CC5E0" d="m32 13 18 9-18 9-18-9 18-9Z" /><path fill="#F4B393" d="m14 31 18 9 18-9v11l-18 9-18-9V31Z" /><path d="m14 22 18 9 18-9M32 31v20" /></g>}
    {kind === "senior" && <g {...common}><path fill="#F4B393" d="M42 30c0 6-5 8-6 13h-8c-1-5-6-7-6-13a10 10 0 1 1 20 0Z" /><path d="M28 48h8M29 53h6M32 9v5M13 29h5M46 29h5M18 15l4 4M46 15l-4 4" /></g>}
    {kind === "interview" && <g {...common}><rect x="15" y="19" width="34" height="29" rx="5" fill="#9CC5E0" /><path d="M25 19v-4h14v4M23 30h18M23 36h13M23 42h9" /><circle cx="42" cy="40" r="5" fill="#F4B393" /></g>}
  </svg>;
}
