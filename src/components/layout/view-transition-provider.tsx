"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function shouldSkip() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

function vt(fn: () => void) {
  const t = document.startViewTransition(() => { fn(); });
  // promise 可能被浏览器 abort，不处理导致控制台显示 "Transition was skipped"
  t.updateCallbackDone.catch(() => {});
  t.ready.catch(() => {});
  t.finished.catch(() => {});
}

export function ViewTransitionProvider() {
  const router = useRouter();

  useEffect(() => {
    if (shouldSkip()) return;

    if (typeof document === "undefined" || !document.startViewTransition) return;

    const origPush = router.push.bind(router);
    router.push = ((href: string, options?: any) => vt(() => origPush(href, options))) as typeof router.push;

    const origReplace = router.replace.bind(router);
    router.replace = ((href: string, options?: any) => vt(() => origReplace(href, options))) as typeof router.replace;

    const origBack = router.back.bind(router);
    const origForward = router.forward.bind(router);
    router.back = () => vt(() => origBack());
    router.forward = () => vt(() => origForward());

    return () => {
      router.push = origPush as any;
      router.replace = origReplace as any;
      router.back = origBack;
      router.forward = origForward;
    };
  }, [router]);

  return null;
}
