const fallbackUrl = "https://devpath-puce.vercel.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl).replace(/\/$/, "");

export const siteName = "DevPath";
export const siteDescription = "คลังความรู้และเส้นทางการเรียนรู้สำหรับ Software Developer ตั้งแต่พื้นฐานจนถึงระบบ Production";
