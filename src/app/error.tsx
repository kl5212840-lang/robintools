"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: "hsla(0,72%,60%,0.06)", border: "1px solid hsla(0,72%,60%,0.18)" }}>
        <AlertTriangle className="h-10 w-10" style={{ color: "var(--color-danger)" }} />
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>页面出错了</h1>
      <p className="mb-8 max-w-md text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        抱歉，发生了意外错误。请尝试刷新页面，或返回首页。
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="btn-glass-primary inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重试
        </button>
        <Link
          href="/"
          className="btn-glass-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
