"""PreToolUse hook: 在 WebSearch/WebFetch 前提醒 context7 可替代。"""
import sys, json

data = json.load(sys.stdin)
tool = data.get("tool_name", "")

if tool in ("WebSearch", "WebFetch"):
    query_hint = ""
    ti = data.get("tool_input", {})
    if isinstance(ti, dict):
        query_hint = ti.get("query", "") or ti.get("url", "") or ""
    if query_hint:
        query_hint = query_hint[:80]

    print(f"\n>>> context7? {query_hint}... -> Robinちゃん「用 context7」\n", file=sys.stderr)

sys.exit(0)
