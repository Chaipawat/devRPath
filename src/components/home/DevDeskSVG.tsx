import type { CSSProperties } from "react";

// Flat version of the 3D desk scene, used on small screens and with reduced motion.
const codeLines: [indent: number, width: number, color: string][] = [
  [0, 150, "#8f8a80"], [0, 110, "#ff8a5c"], [0, 0, ""], [0, 170, "#f6f4ef"], [0, 0, ""],
  [0, 130, "#ff8a5c"], [18, 150, "#8fa8ff"], [18, 110, "#f6f4ef"], [0, 14, "#f6f4ef"], [0, 120, "#7fd1a8"],
];
const chips: [x: number, y: number, text: string, color: string][] = [
  [70, 70, "</>", "#ff5a1f"], [488, 58, "{ }", "#2f5bff"], [520, 190, "=>", "#0e0e0e"], [34, 200, "SQL", "#12a37f"],
];

export function DevDeskSVG() {
  return (
    <svg className="dev-desk-svg" viewBox="0 0 600 520" role="img" aria-label="Mochi แมวส้มสะพายเป้ AI กำลังเขียนโค้ด">
      <ellipse cx="300" cy="496" rx="250" ry="14" fill="#0e0e0e12" />

      {/* desk */}
      <rect x="62" y="346" width="8" height="142" fill="#16140f" />
      <rect x="530" y="346" width="8" height="142" fill="#16140f" />
      <rect x="40" y="332" width="520" height="16" rx="6" fill="#e9e1d2" stroke="#16140f" strokeWidth="2" />

      {/* monitor */}
      <rect x="286" y="262" width="28" height="58" fill="#2a2722" />
      <rect x="244" y="318" width="112" height="12" rx="6" fill="#2a2722" />
      <rect x="140" y="64" width="320" height="200" rx="14" fill="#16140f" />
      <rect x="150" y="74" width="300" height="180" rx="7" fill="#1d1a16" />
      <circle cx="166" cy="88" r="4" fill="#ff5a1f" /><circle cx="180" cy="88" r="4" fill="#e0a100" /><circle cx="194" cy="88" r="4" fill="#12a37f" />
      <g className="svg-code" strokeLinecap="round" strokeWidth="6">
        {codeLines.map(([indent, width, color], i) => (
          <g key={i}>
            <line x1="164" x2="172" y1={110 + i * 13} y2={110 + i * 13} stroke="#57524a" strokeWidth="4" />
            {width > 0 && (
              <line
                x1={186 + indent} x2={186 + indent + width} y1={110 + i * 13} y2={110 + i * 13}
                stroke={color} pathLength={1} style={{ "--i": i } as CSSProperties}
              />
            )}
          </g>
        ))}
      </g>
      <rect className="svg-cursor" x="310" y="226" width="3" height="11" fill="#ff5a1f" />
      <rect x="150" y="242" width="300" height="12" fill="#2f5bff" />
      <rect x="410" y="200" width="30" height="30" rx="2" fill="#ffd84d" transform="rotate(6 425 215)" />

      {/* laptop */}
      <path d="M454 256h92l-6 62h-92Z" fill="#cfc9be" stroke="#16140f" strokeWidth="2" />
      <path d="M461 263h78l-4.5 48h-78Z" fill="#0e0e0e" />
      <path d="M466 275h24M466 286h38M466 297h18" stroke="#7fd1a8" strokeWidth="4" strokeLinecap="round" />
      <path d="M434 318h120l-6 12H440Z" fill="#cfc9be" stroke="#16140f" strokeWidth="2" />

      {/* books + plant + coffee */}
      <rect x="58" y="318" width="92" height="13" rx="3" fill="#2f5bff" />
      <rect x="64" y="305" width="82" height="13" rx="3" fill="#ff5a1f" />
      <rect x="60" y="292" width="78" height="13" rx="3" fill="#12a37f" />
      <path d="M86 262h34l-4 30H90Z" fill="#c8694a" />
      <ellipse cx="94" cy="240" rx="9" ry="24" fill="#0f8a6b" transform="rotate(-24 94 240)" />
      <ellipse cx="112" cy="238" rx="9" ry="26" fill="#12a37f" transform="rotate(22 112 238)" />
      <ellipse cx="103" cy="232" rx="8" ry="28" fill="#12a37f" />
      <rect x="392" y="298" width="30" height="34" rx="4" fill="#fbfaf7" stroke="#16140f" strokeWidth="2" />
      <rect x="392" y="306" width="30" height="7" fill="#ff5a1f" />
      <path d="M422 306c10 0 10 16 0 16" fill="none" stroke="#16140f" strokeWidth="2" />
      <path className="svg-steam" d="M402 290c-5-7 5-11 0-18M412 290c-5-7 5-11 0-18" fill="none" stroke="#b7b2a8" strokeWidth="2" strokeLinecap="round" />

      {/* keyboard */}
      <rect x="208" y="324" width="184" height="10" rx="4" fill="#2a2722" />

      {/* Mochi, turned round to say hi */}
      <path d="M220 470c0-72 22-118 80-122 58 4 80 50 80 122Z" fill="#efc38a" />
      <g fill="none" stroke="#cf8645" strokeOpacity=".55" strokeWidth="8" strokeLinecap="round">
        <path d="M232 420c10-4 18-4 26 0M234 446c10-4 18-4 26 0M342 420c8-4 16-4 26 0M340 446c8-4 16-4 26 0" />
      </g>
      <ellipse cx="300" cy="404" rx="40" ry="52" fill="#fbeedd" />
      <rect x="366" y="370" width="42" height="58" rx="15" fill="#a9b8dc" />
      <rect x="372" y="378" width="30" height="42" rx="10" fill="#c9d3ec" />
      <path d="M404 382v34" stroke="#62f3ff" strokeWidth="3" strokeLinecap="round" className="svg-led" />
      <text x="387" y="408" textAnchor="middle" fill="#6f7fa8" style={{ font: "700 13px system-ui, sans-serif" }}>AI</text>
      <rect x="252" y="340" width="96" height="13" rx="6.5" fill="#e0782f" />
      <circle cx="300" cy="360" r="8.5" fill="#e3b33c" /><path d="M300 362v5" stroke="#3a2a10" strokeWidth="2" />
      <g className="svg-cat-head">
        <path d="M240 270Q238 222 258 214q20 8 32 32Z" fill="#efc38a" /><path d="M360 270q2-48-18-56-20 8-32 32Z" fill="#efc38a" />
        <path d="M250 258q0-26 10-32 12 6 18 20Z" fill="#f2a3a8" /><path d="M350 258q0-26-10-32-12 6-18 20Z" fill="#f2a3a8" />
        <ellipse cx="300" cy="292" rx="70" ry="58" fill="#efc38a" />
        <path d="M286 244v14M300 240v16M314 244v14" stroke="#cf8645" strokeOpacity=".7" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="285" cy="316" rx="18" ry="13" fill="#fbeedd" /><ellipse cx="315" cy="316" rx="18" ry="13" fill="#fbeedd" />
        <g className="svg-blink">
          <circle cx="273" cy="290" r="14" fill="#c9c46a" stroke="#2a2418" strokeWidth="2" /><circle cx="327" cy="290" r="14" fill="#c9c46a" stroke="#2a2418" strokeWidth="2" />
          <ellipse cx="273" cy="290" rx="5" ry="10" fill="#15130e" /><ellipse cx="327" cy="290" rx="5" ry="10" fill="#15130e" />
          <circle cx="269" cy="285" r="3.5" fill="#fff" /><circle cx="323" cy="285" r="3.5" fill="#fff" />
        </g>
        <path d="M295 307h10l-5 6Z" fill="#ee9a9f" />
        <path d="M300 313q-4 8-11 5M300 313q4 8 11 5" fill="none" stroke="#b86b4a" strokeWidth="2" strokeLinecap="round" />
        <path d="M262 314h-30M262 320l-28 6M338 314h30M338 320l28 6" stroke="#fffaf2" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* chair */}
      <rect x="214" y="404" width="172" height="78" rx="18" fill="#16140f" />
      <rect x="292" y="482" width="16" height="10" fill="#2a2722" />
      <path d="M246 494h108" stroke="#2a2722" strokeWidth="6" strokeLinecap="round" />
      <g className="svg-tail">
        <path d="M372 456c36-4 48-46 34-76-7-16-24-16-24-2" fill="none" stroke="#efc38a" strokeWidth="15" strokeLinecap="round" />
        <path d="M372 456c36-4 48-46 34-76-7-16-24-16-24-2" fill="none" stroke="#cf8645" strokeOpacity=".6" strokeWidth="15" strokeDasharray="9 13" />
      </g>

      {chips.map(([x, y, text, color], i) => (
        <g key={text} className="svg-chip" style={{ "--i": i } as CSSProperties}>
          <rect x={x} y={y} width={text.length * 9 + 22} height="26" rx="13" fill="#fbfaf7" stroke={color} />
          <text x={x + 11} y={y + 17} fill={color}>{text}</text>
        </g>
      ))}
    </svg>
  );
}
