"use client";

import dynamic from "next/dynamic";

// WebGL + canvas textures need the browser, so the preview never renders on the server.
export const LattePreviewLoader = dynamic(() => import("./LattePreview"), { ssr: false });
