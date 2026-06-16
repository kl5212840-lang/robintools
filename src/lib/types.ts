// 工具元信息
export interface ToolMeta {
  id: string
  name: string
  nameZh: string
  description: string
  icon: string // lucide icon name
  difficulty: 1 | 2 | 3 // 1=简单 2=中等 3=困难
  estimatedTime: string // 例如 "5-10min"
  platforms: ("windows" | "macos" | "linux")[]
  guideTypes: GuideType[]
  color: string // Tailwind 颜色类名, 用于卡片装饰
  status: "ready" | "coming-soon"
  availableGuides?: string[] // 该工具已编写的指南类型列表
  pricing?: string // 价格速览，如 "Free / Pro $20/月"
}

// 指南类型
export interface GuideType {
  id: string
  name: string
  nameZh: string
  description: string
  icon: string
}

// 指南内容
export interface GuideContent {
  title: string
  description: string
  platform?: string
  order: number
  slug: string
}

// 工具元信息文件结构
export interface ToolMetaFile {
  tool: Omit<ToolMeta, "guideTypes">
  guides: Record<string, GuideContent[]>
}

// 全局工具注册表
export interface ToolsRegistry {
  tools: ToolMeta[]
  guideTypes: GuideType[]
}
