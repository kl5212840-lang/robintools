"""PreToolUse hook — 阻断危险 Git 命令，由 settings.local.json 调用。

读取 stdin 的 JSON，检查 Bash 命令是否命中禁止规则。
命中 → stderr 输出原因 + exit 1（阻断）
未命中 → exit 0（放行）
"""
import sys, json, re

# 强制 UTF-8，Windows 兼容
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

FORBIDDEN = [
    # (regex, 人类可读名称)
    # git push -f 需要两个模式：紧邻 push 的 -f，和远端的 -f
    (r'git\s+push\s+-f(?:\s|$)',                  'git push -f'),
    (r'git\s+push\s+.*\s-f(?:\s|$)',              'git push -f'),
    (r'git\s+push\s+.*--force',                   'git push --force'),
    (r'git\s+commit\s+.*--amend',                 'git commit --amend'),
    (r'git\s+commit\s+.*--no-verify',             'git commit --no-verify'),
    (r'git\s+commit\s+.*--no-gpg-sign',           'git commit --no-gpg-sign'),
    (r'git\s+add\s+(-A\b|\.(?:\s|$)|--all)',     'git add -A / git add .'),
    (r'git\s+reset\s+--hard',                     'git reset --hard'),
    (r'git\s+clean\s+.*-f',                       'git clean -f'),
    (r'git\s+checkout\s+--\s+\.',                 'git checkout -- .'),
    (r'git\s+restore\s+\.(?:\s|$)',               'git restore .'),
    (r'git\s+branch\s+-D',                        'git branch -D'),
    (r'rm\s+-rf\s+(/[^\s]|~[^\s]|\.\.)',          'rm -rf 危险路径'),
]


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    cmd = data.get('tool_input', {}).get('command', '') or ''

    for pattern, name in FORBIDDEN:
        if re.search(pattern, cmd):
            sys.stderr.write(
                f'\n>>> PreToolUse Hook: BLOCKED\n'
                f'    Operation: {name}\n'
                f'    Reason: forbidden by AI_SAFETY_RULES\n'
                f'    Command: {cmd[:120]}\n\n'
            )
            sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()
