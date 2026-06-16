# /publish — 审查、提交、推送

## 触发

用户输入 `/publish` 即可。该命令隐含 L3（commit）+ L4（push）授权。

## 执行步骤

### 第 0 步：安全上下文验证（L3+L4 保护）

`/publish` 是本项目唯一涉及 L3（commit）+ L4（push）的命令。在执行任何操作前，必须完成以下自我检查：

1. **权限边界确认**：回顾 AI_SAFETY_RULES 中定义的 L1-L5 等级
   - L3（commit）：用户是否在本次对话中明确授权了 commit？
   - L4（push）：用户是否在本次对话中明确授权了 push？
   - 如果 `/publish` 是用户输入的第一个指令（无前置对话），视为隐式授权 L3+L4。
   - 如果 `/publish` 在长会话中执行（前面 > 5 轮对话），必须额外确认。

2. **禁止操作清单**：在执行前回顾以下禁止项，确保不使用：
   - `git add .` / `git add -A`
   - `git commit --amend`
   - `git push --force`
   - `git reset --hard`
   - 跳过 hooks（`--no-verify` / `--no-gpg-sign`）
   - 隐式升级操作等级（commit 后不自动 push）

3. **自检输出**（必须显示在 /publish 执行的第一步）：
   ```
   🔒 安全上下文已验证
      当前操作等级：L3（commit）+ L4（push）
      授权来源：用户输入 /publish
      禁止操作清单：已回顾
      分支：<current-branch>
   ```

**如果任何一项不确定** → 停止执行，询问用户。

### 第 1 步：检测改动来源

检查两个位置：

```bash
git diff --staged --stat    # PostToolUse hook 自动 stage 的改动
git diff --stat             # VSCode 编辑产生但未 stage 的改动
```

四种情况：

| staged | working | 处理 |
|--------|---------|------|
| 有改动 | 有改动 | 合并展示，一并处理 |
| 有改动 | 无改动 | 仅处理 staged |
| 无改动 | 有改动 | 需要先 stage |
| 无改动 | 无改动 | 退出："没有可发布的改动" |

**如果 staged 为空但 working tree 有改动**：

展示 working tree 的文件列表：
```
📋 以下文件有未暂存改动：

   <file1>
   <file2>

   这些改动需要先 stage 才能发布。
   回复 "stage" 继续，或回复 "cancel" 取消。
```

用户回复 "stage" 后，对每个文件执行 `git add`（**禁止 `git add .` 或 `git add -A`**）。

### 第 2 步：执行 /review

按照 `/review` 命令的完整逻辑审查所有改动。审查范围 = staged + working tree 的并集。

**如果发现 ❌ 严重问题**：
```
⛔ 发布已阻止 — 发现 N 个严重问题

<逐条列出>

修复后重新 /publish。
```
停止，不进入第 3 步。

**如果只有 ⚠️ 建议**：
```
⚠️ 审查通过但有 N 条建议

<逐条列出>

是否仍然发布？回复 "publish" 继续，或回复 "cancel" 取消。
```

**如果全部 ✅**：自动进入第 3 步。

### 第 3 步：类型检查

```bash
npx tsc --noEmit
```

**失败**：
```
⛔ 发布已阻止 — TypeScript 类型检查失败

<输出错误摘要>

修复类型错误后重新 /publish。
```
停止。

**通过**：进入第 3.1 步。

### 第 3.1 步：SSG 安全检测（服务端组件边界）

`tsc` 无法检测"客户端 API 用在服务端组件"的错误（如 SSR 构建崩溃）。服务端组件文件改动时需额外验证。

检查 staged diff 是否涉及以下服务端组件：
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/**/layout.tsx`（任何 layout 文件）

**命中**：
```
⚠️ 检测到服务端组件改动，需运行完整构建验证。
正在运行 npm run build...
```

然后执行 `npm run build`。

**未命中**：跳过，直接进入第 3.2 步。

**构建失败**：
```
⛔ 发布已阻止 — SSG 构建失败

<输出错误摘要>

常见原因：
- 在服务端组件中直接使用了客户端 API（如 framer-motion 的 motion.div）
  修复：拆为独立的 "use client" 组件
```

### 第 3.2 步：pre-push 预检（模拟推送检查）

在 commit 之前，运行 pre-push hook 脚本验证：

```bash
bash .githooks/pre-push
```

脚本会对当前 commit range 做完整的四层检查（文件白名单 + 拦截规则 + 密钥扫描 + 内容质量）。如果预检失败，说明 push 时也会失败——在 commit 前发现问题比 push 时被拦少一轮无效 commit。

**失败**：
```
⛔ pre-push 预检失败

<脚本输出>

在 commit 前修复以上问题，然后重新 /publish。
```
停止。修完问题后重新 `/publish`。

**通过**：自动进入第 4 步。

### 第 4 步：最终展示 + commit 确认

展示将要 commit 的完整内容：

```
📦 准备发布 — <N> 个文件

   <文件清单 + 增删行数>

📝 提交信息：
   <1-2 句中文，说明"为什么"改>

回复 "commit" 确认提交，或回复其他内容修改提交信息，或回复 "cancel" 取消。
```

如果 staged 区仍为空（边缘情况），先 `git add <file>` 再进入确认。

### 第 5 步：commit

用户回复 "commit" 后：

```bash
git commit -m "<提交信息>"
```

输出：
```
✅ 已提交：<commit hash>
```

如果 pre-commit hook 失败：commit 未发生，展示 hook 输出，停止。

### 第 6 步：push 确认

```
🚀 是否推送到远程？

   当前分支：<branch>
   远程目标：origin/<branch>

回复 "push" 推送，或回复 "cancel" 取消。
```

**禁止自动推送。必须等用户确认。**

### 第 7 步：push + 部署验证

用户回复 "push" 后：

```bash
git push
```

push 成功后，自动执行推送验证（对照 remote hash）：

```bash
git log --oneline -1
git ls-remote origin master
```

输出：
```
✅ 已推送 → Vercel 将自动部署

   本地：<hash>
   远程：<hash>  ← 一致

   [1] 查看 GitHub Actions  → 打开 CI 页面
   [2] 完成                  → 结束

   输入数字：
```

如果 hash 不一致 → 重试 push（最多 3 次）。

### 第 8 步：部署提示

push 成功后，告知用户：
```
Vercel 会自动检测 master 分支更新并部署。
GitHub Pages 由 GitHub Actions 自动构建部署。
通常 1-2 分钟内生效。
```

## 确认点汇总

| 步骤 | 需要用户确认 | 确认方式 |
|------|------------|---------|
| working tree 未 stage | 是 | 回复 "stage" |
| review 有 ⚠️ 建议 | 是 | 回复 "publish" |
| review 有 ❌ 问题 | 阻断 | — |
| tsc 失败 | 阻断 | — |
| SSG 构建失败 | 阻断 | — |
| pre-push 预检失败 | 阻断 | — |
| commit | 是 | 回复 "commit" |
| push | 是 | 回复 "push" |

**每个确认点都是独立的一次交互。不自动跳过。**

## 约束

- 禁止 `git add .` 或 `git add -A`（必须指定具体文件）
- 禁止 `git commit --amend`
- 禁止 `git push --force`
- 禁止跳过 hooks
- commit 信息：中文，1-2 句，说明"为什么"
- 如果当前分支不是 master，在 push 确认时额外提醒
