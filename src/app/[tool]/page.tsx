import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTool, getAllTools } from "@/lib/content";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) return {};
  return {
    title: `${tool.name} 完全指南`,
    description: tool.description,
    openGraph: { title: `${tool.name} 完全指南 | AI Tools Guide`, description: tool.description },
    twitter: { title: `${tool.name} 完全指南 | AI Tools Guide`, description: tool.description },
  };
}

export function generateStaticParams() {
  return getAllTools().map((t) => ({ tool: t.id }));
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params;
  redirect(`/${toolId}/install`);
}
