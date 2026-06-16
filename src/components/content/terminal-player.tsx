"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Play, Pause, RotateCcw, Copy, Gauge, ChevronUp } from "lucide-react";
import type { TerminalRecording } from "@/lib/terminal-recording";

type PlayState = "idle" | "playing" | "paused" | "finished";

const SPEEDS = [1, 2, 4] as const;

// 动态加载 xterm — 模块级缓存，多个 TerminalPlayer 共享 Class 引用
let xtermCache: any = null;
async function loadXterm(): Promise<any> {
  if (xtermCache) return xtermCache;
  const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
    import("xterm"),
    import("@xterm/addon-fit"),
    import("@xterm/addon-web-links"),
  ]);
  await import("xterm/css/xterm.css");
  xtermCache = { Terminal, FitAddon, WebLinksAddon };
  return xtermCache;
}

type TermHandle = {
  write(s: string): void;
  reset(): void;
  dispose(): void;
  open(el: HTMLElement): void;
};

export function TerminalPlayer({
  recording,
  className = "",
  compact = false,
}: {
  recording: TerminalRecording;
  className?: string;
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<TermHandle | null>(null);
  const fitRef = useRef<{ fit(): void } | null>(null);
  const tickRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const indexRef = useRef(0);
  const speedRef = useRef<(typeof SPEEDS)[number]>(SPEEDS[0]);

  const [state, setState] = useState<PlayState>("idle");
  const [speedIdx, setSpeedIdx] = useState(0);

  // ---- 播放帧循环 ----
  const runLoop = useCallback(
    (events: typeof recording.events) => {
      const tw = termRef.current;
      if (!tw) return;
      const now = performance.now() - startRef.current;

      while (indexRef.current < events.length) {
        const e = events[indexRef.current];
        if (e.t > now * speedRef.current) break;
        tw.write(e.value);
        indexRef.current++;
      }

      if (indexRef.current >= events.length) {
        setState("finished");
        return;
      }
      tickRef.current = requestAnimationFrame(() => runLoop(events));
    },
    [],
  );

  // ---- 创建终端实例 ----
  const ensureTerminal = useCallback(
    async (): Promise<TermHandle> => {
      if (termRef.current) return termRef.current;
      const { Terminal, FitAddon, WebLinksAddon } = await loadXterm();
      const term = new Terminal({
        cursorBlink: false,
        cursorStyle: "bar",
        fontSize: 13,
        fontFamily:
          "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
        theme: {
          background: "#181a1a",
          foreground: "#e2e8f0",
          cursor: "#60a5fa",
          selectionBackground: "rgba(96,165,250,0.3)",
          black: "#334155",
          red: "#f87171",
          green: "#4ade80",
          yellow: "#fbbf24",
          blue: "#60a5fa",
          magenta: "#c084fc",
          cyan: "#22d3ee",
          white: "#e2e8f0",
          brightBlack: "#475569",
          brightRed: "#fca5a5",
          brightGreen: "#86efac",
          brightYellow: "#fde68a",
          brightBlue: "#93c5fd",
          brightMagenta: "#d8b4fe",
          brightCyan: "#67e8f9",
          brightWhite: "#f8fafc",
        },
        allowProposedApi: true,
        disableStdin: true,
        rows: compact ? 10 : 14,
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.loadAddon(new WebLinksAddon());
      fitRef.current = fit;

      const handle: TermHandle = {
        write: (s: string) => term.write(s),
        reset: () => term.reset(),
        dispose: () => term.dispose(),
        open: (el: HTMLElement) => term.open(el),
      };
      termRef.current = handle;
      return handle;
    },
    [compact],
  );

  // ---- 挂载终端到 DOM ----
  const mountTerminal = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    const tw = await ensureTerminal();
    tw.open(container);
    // xterm 打开后需要一帧才能拿到正确尺寸
    setTimeout(() => {
      try { fitRef.current?.fit(); } catch { /* 容器隐藏时尺寸为0 */ }
    }, 50);
  }, [ensureTerminal]);

  // ---- 开始播放 ----
  const startPlayback = useCallback(() => {
    cancelAnimationFrame(tickRef.current);
    termRef.current?.reset();
    indexRef.current = 0;
    startRef.current = performance.now();
    setState("playing");
  }, []);

  // ---- state="playing" 驱动帧循环 ----
  useEffect(() => {
    if (state !== "playing") return;
    runLoop(recording.events);
    return () => cancelAnimationFrame(tickRef.current);
  }, [state, recording.events, runLoop]);

  // ---- 卸载清理 ----
  useEffect(() => {
    return () => {
      cancelAnimationFrame(tickRef.current);
      termRef.current?.dispose();
    };
  }, []);

  // ---- compact 变化时重建终端 ----
  useEffect(() => {
    if (termRef.current) {
      termRef.current.dispose();
      termRef.current = null;
    }
  }, [compact]);

  // ---- 按钮事件 —— 直接操作，不走 useEffect 中转 ----
  const handlePlay = useCallback(async () => {
    speedRef.current = SPEEDS[speedIdx];
    if (state === "idle" || state === "finished") {
      // idel: 首次挂载 / finished: 容器仍在，reset 清屏
      if (state === "idle") await mountTerminal();
      startPlayback();
    } else {
      // paused: 从断点继续
      startRef.current = performance.now() -
        (indexRef.current > 0 ? recording.events[indexRef.current - 1].t / speedRef.current : 0);
      setState("playing");
    }
  }, [state, speedIdx, recording.events, mountTerminal, startPlayback]);

  const handlePause = useCallback(() => {
    cancelAnimationFrame(tickRef.current);
    setState("paused");
  }, []);

  const handleRestart = useCallback(() => {
    speedRef.current = SPEEDS[speedIdx];
    startPlayback();
  }, [speedIdx, startPlayback]);

  const handleCollapse = useCallback(() => {
    cancelAnimationFrame(tickRef.current);
    termRef.current?.reset();
    indexRef.current = 0;
    setState("idle");
  }, []);

  const handleCopy = useCallback(() => {
    const lastInput = recording.events
      .filter((e) => e.type === "input")
      .map((e) => e.value.trim())
      .pop();
    if (lastInput) navigator.clipboard.writeText(lastInput);
  }, [recording.events]);

  const handleSpeedChange = useCallback(() => {
    const next = (speedIdx + 1) % SPEEDS.length;
    speedRef.current = SPEEDS[next];
    setSpeedIdx(next);
  }, [speedIdx]);

  const speed = SPEEDS[speedIdx];

  if (state === "idle") {
    return (
      <div className={className}>
        <button
          onClick={handlePlay}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95"
          style={{
            background: "var(--color-surface-overlay)",
            color: "var(--color-accent)",
            border: "1px solid var(--color-border-subtle)",
          }}
          aria-label={`播放终端回放：${recording.title}`}
        >
          <Play className="h-3.5 w-3.5" />
          终端回放：{recording.title}
        </button>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: "#0f1111" }}
      >
        <span className="text-[12px] font-medium" style={{ color: "#94a3b8" }}>
          {recording.title}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSpeedChange}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-white/10"
            style={{ color: "#94a3b8" }}
            title="切换播放速度"
            aria-label={`播放速度 ${speed}x，点击切换`}
          >
            <Gauge className="h-3 w-3" />
            {speed}x
          </button>
          <span className="w-px h-4 mx-0.5" style={{ background: "#334155" }} />
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-white/10"
            style={{ color: "#94a3b8" }}
            title="复制最后一条命令"
            aria-label="复制最后一条命令"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-white/10"
            style={{ color: "#94a3b8" }}
            title="重播"
            aria-label="重播"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <span className="w-px h-4 mx-0.5" style={{ background: "#334155" }} />
          <button
            onClick={handleCollapse}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-white/10"
            style={{ color: "#94a3b8" }}
            title="收起终端"
            aria-label="收起终端"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* xterm 容器 */}
      <div
        ref={containerRef}
        className="w-full"
        style={{ background: "#181a1a", minHeight: compact ? 180 : 260, overflow: "hidden" }}
        onWheel={(e) => e.stopPropagation()}
      />

      {/* 播放控制栏 */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: "#0f1111" }}
      >
        <button
          onClick={state === "playing" ? handlePause : handlePlay}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all hover:scale-[1.05] active:scale-95"
          style={{
            background:
              state === "playing"
                ? "rgba(248,113,113,0.15)"
                : "rgba(74,222,128,0.15)",
            color: state === "playing" ? "#f87171" : "#4ade80",
          }}
          aria-label={state === "playing" ? "暂停" : "继续播放"}
        >
          {state === "playing" ? (
            <><Pause className="h-3.5 w-3.5" /> 暂停</>
          ) : (
            <><Play className="h-3.5 w-3.5" /> 继续</>
          )}
        </button>

        <span className="text-[12px] ml-auto" style={{ color: "#64748b" }}>
          {state === "finished"
            ? "播放完毕"
            : state === "playing"
              ? `播放中 · ${speed}x`
              : "已暂停"}
        </span>
      </div>
    </div>
  );
}
