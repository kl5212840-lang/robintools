# /edit — 搜索、打开、等待编辑、自动检测改动

## 触发

用户输入 `/edit <搜索词>`，搜索词可以是：

- **文章标题**：如 "MCP 配置避坑指南"
- **文章 slug**：如 "mcp-config-pitfall-guide"
- **工具名**：如 "Claude Code"、"claude-code"
- **工具 + 指南类型**：如 "Claude Code 安装"、"codex config"
- **文件名片段**：如 "install"、"troubleshoot"

## 执行步骤

### 第 1 步：解析输入

从用户输入中提取搜索词。去掉 `/edit` 前缀，trim 空白。

### 第 2 步：搜索文章

读取 `src/content/articles/index.ts`，在 `articleRegistry` 中匹配：

- 搜索词的归一化形式是否包含在 `slug` 中
- 搜索词是否包含在 `title` 中

命中后，从文件顶部的 import 语句找到对应的文件路径。

```typescript
// 示例：index.ts 中的 import
import { renderMCPConfigPitfallGuide } from "./mcp-config-pitfall-guide";
// → 文件路径：src/content/articles/mcp-config-pitfall-guide.tsx
```

### 第 3 步：搜索指南

读取 `src/content/guides/registry.ts`，在 `guideRegistry` 中匹配：

- `toolId` 是否匹配搜索词
- `guideType`（install/config/troubleshoot/tutorial）是否匹配搜索词

命中后，从文件顶部的 import 语句找到对应文件路径。

```typescript
// 示例：registry.ts 中的 import
import renderClaudeInstall from "./claude-code/install";
// → 文件路径：src/content/guides/claude-code/install.tsx
```

指南类型中文映射：
- install → 安装
- config → 配置
- troubleshoot → 排查 / 故障排查
- tutorial → 教程 / 使用教程

### 第 4 步：搜索工具元数据

读取 `src/content/tools.json`，匹配 `id`、`name` 或 `nameZh`。

### 第 5 步：输出结果

**精准匹配（1 条）**：
```
📄 <title>
   <path>
```

**模糊匹配（2-5 条）**：
```
🔍 找到 N 个匹配：
   1. <title> — <path>
   2. <title> — <path>
   ...
   请输入序号选择，或输入更精确的搜索词。
```

**无匹配**：
```
❌ 未找到匹配的内容文件。

   可搜索的范围：
   · 文章标题或 slug（如 "MCP 配置避坑"、"mcp-config"）
   · 工具名（如 "Claude Code"、"codex"）
   · 工具 + 指南类型（如 "Claude Code 安装"、"windsurf 配置"）
```

### 第 6 步：在 VSCode 打开并等待

精准匹配或用户选择后，使用 `code --wait` 打开文件。**关键：`--wait` 会阻塞直到文件在 VSCode 中被关闭。**

```bash
code --wait "<absolute-path>"
```

行为说明：
- 用户关闭文件标签页（Ctrl+W）→ `--wait` 返回 → 进入第 7 步
- 用户关闭整个 VSCode 窗口 → `--wait` 返回 → 进入第 7 步
- 用户只是 Alt+Tab 切走但不关标签页 → `--wait` 仍在阻塞，继续等待
- 如果 `code` 命令不可用（非 VSCode 环境）→ 提示手动操作，流程结束

### 第 7 步：检测改动 + 交互选择

`--wait` 返回后，检查文件是否有改动：

```bash
git diff -- "<absolute-path>"
```

**无改动**（diff 为空）：
```
✅ 文件无改动。

   [1] 重新编辑  → 再次在 VSCode 打开
   [2] 完成       → 结束

   输入 1/2：
```

**有改动**（diff 非空）：

1. 输出改动摘要：
   ```
   📝 检测到改动：

   +N 行   -N 行   <文件路径>

   ─── 改动内容预览 ───
   <前 30 行 diff>
   ────────────────────
   ```

2. 输出选择菜单（**必须显示**）：
   ```
   [1] 审查改动           → 自动执行 /review <file>
   [2] 深度审查            → 自动执行 /review <file> --deep
   [3] 本地预览            → npm run dev 启动服务器，在浏览器查看效果
   [4] 继续编辑            → 重新 code --wait 打开
   [5] 撤销改动并重新编辑   → git checkout + code --wait
   [6] 撤销改动并退出       → git checkout + 结束
   [7] 直接发布（跳过审查） → 自动执行 /publish

   输入数字即可，无需输入命令名：
   ```

3. **用户只需输入一个数字**（1-7），Claude 自动执行对应操作。
4. **不自动 stage、不自动 commit、不自动 push。**

### 第 8 步：执行用户选择

| 用户输入 | Claude 执行 |
|---------|------------|
| 1 | 自动执行 `/review <file>` |
| 2 | 自动执行 `/review <file> --deep` |
| 3 | 运行 `npm run dev`，给出 http://localhost:3000 链接。用户确认后返回选择菜单。 |
| 4 | 重新 `code --wait <file>` → 返回第 7 步 |
| 5 | `git checkout -- <file>` → `code --wait <file>` → 返回第 7 步 |
| 6 | `git checkout -- <file>` → 结束 |
| 7 | 自动执行 `/publish` |

**禁止**在选择 7 时跳过 `/publish` 内建的 review 步骤。

## 约束

- 全程 L1（只读搜索 + 打开文件 + 检测改动），不修改任何内容
- 不自动 stage、不自动 commit、不自动 push
- 不遍历 node_modules 或其他非内容目录
- 搜索结果限制在 `src/content/` 范围内
