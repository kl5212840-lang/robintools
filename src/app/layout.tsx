import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/layout/theme-context";
import { ToastProvider } from "@/components/layout/toast";
import { PageTransition } from "@/components/layout/page-transition";
import { ViewTransitionProvider } from "@/components/layout/view-transition-provider";
import { LiquidGlassFilter } from "@/components/layout/liquid-glass";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-top";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://robinupup.com"),
  title: {
    default: "AI Tools Guide — AI 开发工具配置指南",
    template: "%s | AI Tools Guide",
  },
  description:
    "中文 AI 开发工具一站式配置指南。覆盖 Claude Code、Codex、Cursor、GitHub Copilot、Windsurf 等主流工具的安装、配置与使用教程。",
  keywords: ["AI工具", "Claude Code", "Codex", "Cursor", "Copilot", "Windsurf", "AI配置", "AI教程"],
  authors: [{ name: "AI Tools Guide" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "AI Tools Guide",
    title: "AI Tools Guide — AI 开发工具配置指南",
    description:
      "中文 AI 开发工具一站式配置指南。覆盖 Claude Code、Codex、Cursor 等主流工具的安装、配置与使用教程。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Guide — AI 开发工具配置指南",
    description:
      "中文 AI 开发工具一站式配置指南。覆盖 Claude Code、Codex、Cursor 等主流工具的安装、配置与使用教程。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AI Tools Guide",
              alternateName: "Robin Tools",
              url: "https://robinupup.com",
              description: "中文 AI 开发工具一站式配置指南。覆盖 Claude Code、Codex、Cursor、GitHub Copilot、Windsurf 等主流工具的安装、配置与使用教程。",
              inLanguage: "zh-CN",
            }),
          }}
        />
        <style>{`html{background:hsl(180 4% 10%)}html:not(.dark){background:hsl(0 0% 97%)}`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.remove('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col text-foreground">
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-[var(--color-accent)] focus:text-white focus:px-4 focus:py-2 focus:text-[15px] focus:font-medium"
        >
          跳转到主内容
        </a>
        <ThemeProvider>
          <ToastProvider>
            <LiquidGlassFilter />
            {/* Grain texture — SVG noise overlay for tactile feel */}
            <svg aria-hidden="true" className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#grain)" />
            </svg>
            <ViewTransitionProvider />
            <Navbar />
            <PageTransition>
              <ErrorBoundary>
                <main id="main-content" className="flex-1">{children}</main>
              </ErrorBoundary>
            </PageTransition>
            <Footer />
            <ScrollToTop />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
