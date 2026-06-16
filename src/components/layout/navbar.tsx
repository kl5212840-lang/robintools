"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X, Globe, BookOpen, Home, Wrench, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { RobinLogo } from "@/components/layout/robin-logo";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { CommandPalette } from "@/components/layout/command-palette";

const toolLinks = [
  { href: "/claude-code/install", label: "Claude Code" },
  { href: "/codex/install", label: "Codex CLI" },
  { href: "/cursor/install", label: "Cursor" },
  { href: "/copilot/install", label: "Copilot" },
  { href: "/windsurf/install", label: "Windsurf" },
  { href: "/cline/install", label: "Cline" },
  { href: "/github-spark/install", label: "GitHub Spark" },
];

export function Navbar() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isActive = (href: string) => {
    if (pathname === href || pathname.startsWith(href + "/")) return true;
    // /claude-code/install 也匹配 /claude-code/config 等同工具子页
    if (href.endsWith("/install")) {
      const root = href.replace(/\/install$/, "");
      if (pathname.startsWith(root + "/")) return true;
    }
    return false;
  };

  const handleToolsEnter = () => { clearTimeout(closeTimer.current); setToolsOpen(true); };
  const handleToolsLeave = () => { closeTimer.current = setTimeout(() => setToolsOpen(false), 150); };

  // 移动端检测 — 低于 md 断点(768px)时使用简化导航栏
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // 静止时加大模糊，移动端始终高模糊
  const [isIdle, setIsIdle] = useState(true);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (window.matchMedia("(max-width: 767px)").matches) return; // 移动端不动
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <header className="sticky z-50 w-full" style={{ top: "var(--navbar-top, 0px)" }}>
      {isMobile ? (
        <>
        {/* 移动端：固态背景，无液态玻璃 */}
        <div className="h-14 flex items-center border-b" style={{
          background: "var(--color-base)",
          borderColor: "var(--color-border-subtle)",
        }}>
          <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-2 px-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-[var(--color-text-primary)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg logo-shine">
                <RobinLogo size={32} />
              </div>
            </Link>

            <div className="flex-1" />

            {/* Mobile quick links */}
            <Link href="/articles" className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <BookOpen className="h-4 w-4" /> 笔记
            </Link>
            <Link href="/compare" className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <Globe className="h-4 w-4" /> 对比
            </Link>
            <Link href="/customize" className={`flex items-center gap-1 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
              isActive("/customize") ? "" : ""
            }`}
              style={isActive("/customize")
                ? { color: "var(--color-accent)", background: "var(--color-accent-glow)" }
                : { color: "var(--color-accent)" }
              }
            >
              <Palette className="h-4 w-4" /> 定制
            </Link>

            <ThemeSwitcher />
            <CommandPalette />

            {/* Hamburger — 工具页高亮 */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                toolLinks.some((t) => isActive(t.href))
                  ? "text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 — 固态背景 */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--color-border-subtle)]" style={{ background: "var(--color-base)" }}>
                <div className="px-4 py-4 space-y-1">
                  <MobileLink href="/" active={isActive("/")} onClick={() => setMobileOpen(false)}><Home className="h-4 w-4" />首页</MobileLink>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-3 py-2">工具</div>
                  {toolLinks.map((t) => (
                    <MobileLink key={t.href} href={t.href} active={isActive(t.href)} onClick={() => setMobileOpen(false)}>{t.label}</MobileLink>
                  ))}
                  <div className="my-1" style={{ borderTop: "1px solid var(--color-border-subtle)" }} />
                  <MobileLink href="/compare" active={isActive("/compare")} onClick={() => setMobileOpen(false)}><Globe className="h-4 w-4" />工具对比</MobileLink>
                  <MobileLink href="/customize" active={isActive("/customize")} onClick={() => setMobileOpen(false)}><Palette className="h-4 w-4" />定制</MobileLink>
                  <MobileLink href="/articles" active={isActive("/articles")} onClick={() => setMobileOpen(false)}><BookOpen className="h-4 w-4" />知识库</MobileLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
      ) : (
        /* 桌面端：液态玻璃 */
      <LiquidGlass variant="heavy" rounded="0" noClip blur={isIdle ? "16px" : "4px"} bg="var(--glass-bg-mobile)" className="transition-[backdrop-filter] duration-700">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-5">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold text-[var(--color-text-primary)] hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg logo-shine">
              <RobinLogo size={36} />
            </div>
            <span className="hidden sm:inline text-[16px] tracking-tight">Robin Tools</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <NavLink href="/" active={isActive("/")}><Home className="h-3.5 w-3.5" />首页</NavLink>

            {/* Tools Dropdown */}
            <div className="relative" onMouseEnter={handleToolsEnter} onMouseLeave={handleToolsLeave}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${
                  toolLinks.some((t) => isActive(t.href))
                    ? "text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)]"
                }`}
              >
                <Wrench className="h-3.5 w-3.5" />工具 <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] shadow-xl py-1 z-50">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setToolsOpen(false)}
                      className={`block px-4 py-2.5 text-[14px] transition-colors ${
                        isActive(t.href)
                          ? "text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)]"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/compare" active={isActive("/compare")}>
              <Globe className="h-3.5 w-3.5" />
              对比
            </NavLink>
            <Link href="/customize" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 hover:brightness-95 ${
              isActive("/customize") ? "" : "hover:bg-[var(--color-surface-overlay)]"
            }`}
              style={isActive("/customize")
                ? { color: "var(--color-accent)", background: "var(--color-accent-glow)" }
                : { color: "var(--color-accent)" }
              }
            >
              <Palette className="h-3.5 w-3.5" />
              定制
            </Link>
            <NavLink href="/articles" active={isActive("/articles")}>
              <BookOpen className="h-3.5 w-3.5" />
              笔记
            </NavLink>
          </nav>

          <div className="flex-1" />

          <ThemeSwitcher />
          <CommandPalette />
        </div>
      </LiquidGlass>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[15px] font-medium transition-all ${
        active
          ? "text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)]"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
        active ? "text-[var(--color-accent)] bg-[var(--color-accent-glow)]" : "text-[var(--color-text-secondary)]"
      }`}
    >
      {children}
    </Link>
  );
}


