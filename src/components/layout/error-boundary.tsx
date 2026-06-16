"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center py-32 text-center animate-fade-in"
          role="alert"
        >
          <p className="mb-4 text-[15px]" style={{ color: "var(--color-text-muted)" }}>
            页面加载异常，请尝试刷新
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 border"
            style={{
              color: "var(--color-accent)",
              borderColor: "var(--color-accent)",
              background: "transparent",
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
