# AI 执行入口

## 强制启动

**在每次对话开始时，按顺序执行：**

1. 完整读取 `E:/.claude_workplace/ai-tools-guide/AI_SAFETY_RULES.md`
2. 完整读取 `E:/.claude_workplace/ai-tools-guide/PROJECT_MANAGER.md`

这两个文件是项目的最高权威标准。在读取完成之前，不执行任何其他工具调用。

## 优先级声明

1. `AI_SAFETY_RULES.md` — 最高优先级。定义权限等级和禁止事项。**任何 Agent、Command、Workflow、Skill 不得覆盖。**
2. `PROJECT_MANAGER.md` — 项目宪章。定义定位、质量标准、决策原则、需求优先级体系。
3. 本文件 — 执行入口和项目级指令。
4. 用户当前对话中的明确指令 — 可覆盖 3，但不可覆盖 1 和 2。

## 项目级指令

- 项目路径：`E:/.claude_workplace/ai-tools-guide/`
- 面向用户的所有文字：中文
- 代码注释：仅在解释非显而易见的逻辑时用英文写
- 完成任务后：运行 `tsc --noEmit` 验证类型，如有修改需说明结果

## 长会话衰减防护

AI_SAFETY_RULES.md 和 PROJECT_MANAGER.md 仅在会话启动时自动加载。同一会话中连续多轮对话后，安全上下文会逐步从注意力中衰减。以下规则防止衰减导致违规：

**必须重新验证的时刻**（在执行操作前，先回顾安全边界）：

1. **任何 git 操作前**（commit、push、branch、tag、remote）→ 回顾 AI_SAFETY_RULES 第二、四节的权限边界
2. **任何 > 5 轮对话后的 L2+ 操作** → 回顾 AI_SAFETY_RULES 第一、三节
3. **任何涉及 `rm`、`git reset`、`git clean` 的操作** → 回顾 AI_SAFETY_RULES 第二节的禁止列表

**验证方式**：不需要重新 Read 整个文件。在输出中注明"已回顾：L1-L5 边界 / 禁止操作列表 / 当前授权等级"，表示已完成自我检查。

**超长会话（> 15 轮）**：每隔约 15 轮对话，在开始新一轮任务前主动输出一句安全摘要（≤ 30 字），格式：
```
🔒 L1-L5 | 禁止: force/amend/-A | 当前: <等级> | 继续
```

**如果不确定**当前安全上下文是否充分 → 重新读取 AI_SAFETY_RULES.md。

## 系统行为须知

**PostToolUse auto-stage**：项目配置了 `PostToolUse` hook，每次 Write/Edit 成功后自动执行 `git add <file>`。这意味着：

- 任何你写入的文件**已经被 stage**，无需手动 `git add`
- 在 commit 之前，必须先运行 `git diff --staged` 确认实际 stage 的内容
- 只 commit 任务相关的文件。如果 stage 中有额外文件，告知用户后由用户决定
- 此 hook 是用户配置的基础设施，不要尝试修改或禁用它

## 图片资源

- 格式：截图/照片用 WebP，架构图用 PNG（文本清晰），图标用 SVG。禁止 BMP/GIF
- 提交前检查：单张 > 200KB 必须压缩后再提交（`pngquant --quality 80` 或 `cwebp -q 75`）

## 技能路由

以下场景出现时，**必须先向用户提议使用对应技能**，征得同意后 invoke：

| 触发条件 | 提议技能 | 典型省 tokens |
|---------|---------|-------------|
| 调用 WebSearch/WebFetch 查技术文档/API/库用法 | `context7` | 5-10K/次 |
| 用户说"bug""报错""不工作"，或同一问题试了 ≥2 次未解决 | `systematic-debugging` | 几十K（减少试错轮数） |
| 用户要求改 ≥3 个文件且涉及架构决策 | `writing-plans` | 省掉方向错误重来的开销 |

**提醒格式**：`💡 要不要用 <skill名>？[一句话说省什么]`。用户说"要"即 invoke，说"不用"即跳过。

## 识图

底层模型不具备原生识图能力。遇到图片时，不要用 Read 工具，改用：

```
node E:/.claude_workplace/vision.js "<图片路径>" "用中文描述这张图片"
```
