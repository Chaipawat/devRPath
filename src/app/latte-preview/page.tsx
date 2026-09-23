import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LattePreviewLoader } from "./LattePreviewLoader";

export const metadata: Metadata = { title: "Latte preview", robots: { index: false } };

/**
 * Dev-only turntable for the Latte model: /latte-preview shows every pose;
 * ?pose=sit&expr=grumpy&face&yaw=0.3 zooms in on one. Returns 404 in production builds.
 */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <LattePreviewLoader />;
}
