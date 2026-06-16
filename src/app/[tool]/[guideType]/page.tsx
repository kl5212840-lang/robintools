import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { getTool, getAvailableGuideTypes, getGuideTypes, getDifficultyStars, getDifficultyLabel, getAllTools, accentColors } from "@/lib/content";
import { GuideTabs } from "@/components/tool/guide-tabs";

interface ContentPageProps {
  params: Promise<{ tool: string; guideType: string }>;
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { tool: toolId, guideType } = await params;
  const tool = getTool(toolId);
  if (!tool) return {};
  const guideTypes = getGuideTypes();
  const gt = guideTypes.find((g) => g.id === guideType);
  const title = gt ? `${tool.name} ${gt.nameZh}` : `${tool.name} 指南`;
  const desc = gt?.description || tool.description;
  return {
    title,
    description: desc,
    openGraph: { title: `${title} | AI Tools Guide`, description: desc },
    twitter: { title: `${title} | AI Tools Guide`, description: desc },
  };
}

export function generateStaticParams() {
  const tools = getAllTools();
  const guideTypes = getGuideTypes();
  const params: { tool: string; guideType: string }[] = [];
  for (const tool of tools) {
    for (const gt of guideTypes) {
      params.push({ tool: tool.id, guideType: gt.id });
    }
  }
  return params;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { tool: toolId, guideType } = await params;
  const tool = getTool(toolId);
  if (!tool) notFound();

  const allGuideTypes = getGuideTypes();
  const guideTypeInfo = allGuideTypes.find((g) => g.id === guideType);
  if (!guideTypeInfo) notFound();

  const guideTypes = getAvailableGuideTypes(toolId);
  const accent = accentColors[tool.color] || accentColors.blue;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[15px] animate-fade-in" style={{color: 'var(--color-text-muted)'}}>
        <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors font-medium">
          首页
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/${tool.id}/install`} className="hover:text-[var(--color-text-primary)] transition-colors font-medium">
          {tool.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold" style={{color: 'var(--color-text-primary)'}}>
          {guideTypeInfo.nameZh}
        </span>
      </nav>

      {/* Tool Header — consistent with [tool]/page.tsx */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-start gap-5">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 text-2xl font-black"
            style={{ background: `${accent}15`, borderColor: `${accent}30`, color: accent }}
          >
            {tool.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{color: 'var(--color-text-primary)'}}>
              {tool.name} {guideTypeInfo.nameZh}
            </h1>
            <p className="mt-3 text-[16px] leading-relaxed max-w-2xl" style={{color: 'var(--color-text-secondary)'}}>
              {guideTypeInfo.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-5 text-[15px]" style={{color: 'var(--color-text-secondary)'}}>
              <span className="flex items-center gap-1.5">
                难度：<span className="text-[16px]" style={{color: accent}}>{getDifficultyStars(tool.difficulty)}</span>
                <span className="font-medium" style={{color: 'var(--color-text-primary)'}}>{getDifficultyLabel(tool.difficulty)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                参考时长：<span className="font-medium" style={{color: 'var(--color-text-primary)'}}>约 {tool.estimatedTime}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar + Content — client component with URL sync */}
      <GuideTabs toolId={tool.id} activeGuide={guideType} guideTypes={guideTypes} />
    </div>
  );
}
