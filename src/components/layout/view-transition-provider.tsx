"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 全局 View Transitions — 跨页面平滑过渡。
 *
 * 桌面端：旧页缩小+模糊消失，新页从下方微升淡入。
 * 移动端：简单淡入，200ms，减少 GPU 负担。
 * prefers-reduced-motion：完全跳过，直接切换。
 *
 * 原理：拦截 Next.js router.push / replace / back / forward，
 * 包装在 document.startViewTransition() 中。
 * 浏览器自动在导航前后两个状态之间做动画。
 * Chrome 109+ / Edge 109+ / Safari 18.2+ 支持。
 */

function shouldSkip() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

export function ViewTransitionProvider() {
  const router = useRouter();

  useEffect(() => {
    if (shouldSkip()) return;

    const v =
      typeof document !== "undefined" && Boolean(document.startViewTransition);

    if (!v) return;

    // Patch router.push
    const origPush = router.push.bind(router);
    router.push = ((href: string, options?: any) => {
      return document.startViewTransition(() => origPush(href, options));
    }) as typeof router.push;

    // Patch router.replace
    const origReplace = router.replace.bind(router);
    router.replace = ((href: string, options?: any) => {
      return document.startViewTransition(() => origReplace(href, options));
    }) as typeof router.replace;

    // Popstate — browser back/forward
    const origBack = router.back.bind(router);
    const origForward = router.forward.bind(router);
    router.back = () => document.startViewTransition(() => origBack());
    router.forward = () => document.startViewTransition(() => origForward());

    // Cleanup — restore original methods on unmount
    return () => {
      router.push = origPush as any;
      router.replace = origReplace as any;
      router.back = origBack;
      router.forward = origForward;
    };

  }, [router]);

  return null;
}
