import type { Metadata } from "next";

export const SITE_URL = "https://kerdanetyvan.dev";
export const SITE_NAME = "Yvan Kerdanet";
const DEFAULT_OG_IMAGE = "/Yvan_portrait.webp";

export function buildMetadata({
  title,
  description,
  path = "",
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
