import { ReactNode } from "react";

/**
 * Page content wrapper — structural only.
 * All cross-page transition animations are handled by View Transition API (src/app/globals.css).
 * Initial load fade-in is delegated to browsers lacking View Transitions support
 * (handled via @starting-style or CSS animation fallback in globals.css).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
