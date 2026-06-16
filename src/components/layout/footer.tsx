import Link from "next/link";

const footerLinks = [
  { href: "/claude-code/install", label: "Claude Code" },
  { href: "/codex/install", label: "Codex CLI" },
  { href: "/cursor/install", label: "Cursor" },
  { href: "/copilot/install", label: "Copilot" },
  { href: "/windsurf/install", label: "Windsurf" },
  { href: "/cline/install", label: "Cline" },
  { href: "/github-spark/install", label: "GitHub Spark" },
  { href: "/compare", label: "工具对比" },
  { href: "/articles", label: "技术笔记" },
];

export function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-link text-[14px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Compliance disclaimer */}
        <div className="text-center">
          <p className="text-[13px] leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            <strong>免责声明</strong>：本站内容仅限个人学习与技术研究。文中涉及的 API 接口、模型服务及网络方案以各平台官方最新文档为准，用户自行承担 API 资费与合规使用风险。本站与 Anthropic、OpenAI、GitHub 等提及的品牌无关联。
          </p>
          <p className="text-[13px] mt-3" style={{ color: 'var(--color-text-muted)' }}>
            Built with Next.js &middot; shadcn/ui &middot; Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
