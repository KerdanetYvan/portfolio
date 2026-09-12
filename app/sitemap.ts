import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/site";
import projects from "../public/projets.json";

const STATIC_ROUTES = [
  { path: "", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/about", changeFrequency: "yearly" as const, priority: 0.6 },
  { path: "/projects", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/skills", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const posts = await getBlogPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.published_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/portfolio/${project.url}`,
    lastModified: project.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries, ...projectEntries];
}
