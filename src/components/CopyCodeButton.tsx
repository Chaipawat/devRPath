"use client";

import { useEffect, useState } from "react";
import { LuCopy } from "react-icons/lu";

// Reads the code from the DOM instead of props so the text isn't serialized twice into the page payload.
export function CopyCodeButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={`copy-code ${copied ? "is-copied" : ""}`}
      onClick={async (event) => {
        const code = event.currentTarget.closest(".code-scroll")?.querySelector("pre")?.innerText ?? "";
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
        } catch {}
      }}
    >
      {!copied && <LuCopy aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}
