import type { MetadataRoute } from "next";
import { execSync } from "child_process";
import { getAllTools, getGuideTypes } from "@/lib/content";
import { getAllArticles } from "@/content/articles";

export const dynamic = "force-static";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://robinupup.com";
}

/** 仓库最后一次 git commit 时间（构建时），git 不可用时降级为构建时间 */
function getRepoLastModified(): Date {
  try {
    const iso = execSync('git log --format="%aI" -1', { encoding: "utf8" }).trim();
    return new Date(iso);
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const tools = getAllTools();
  const guideTypes = getGuideTypes();
  const articles = getAllArticles();
  const repoDate = getRepoLastModified();

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/${tool.id}`,
    lastModified: repoDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guidePages = tools.flatMap((tool) => {
    const available = (tool as { availableGuides?: string[] }).availableGuides;
    const activeGuides = available
      ? guideTypes.filter((g) => available.includes(g.id))
      : guideTypes;
    return activeGuides.map((gt) => ({
      url: `${baseUrl}/${tool.id}/${gt.id}`,
      lastModified: repoDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  });

  const articlePages = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: repoDate, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/compare`, lastModified: repoDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/articles`, lastModified: repoDate, changeFrequency: "monthly", priority: 0.7 },
    ...articlePages,
    ...toolPages,
    ...guidePages,
  ];
}
