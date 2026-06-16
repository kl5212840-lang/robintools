# /factcheck — 单篇文章事实核实

## 触发

`/factcheck <搜索词>`

## 执行步骤

### 第 1 步：定位文件

复用 `/edit` 命令的第 2-5 步搜索逻辑（articles/index.ts + guides/registry.ts + tools.json）。

精准匹配 → 直接进入第 2 步。模糊匹配 → 让用户选。无匹配 → 退出。

### 第 2 步：提取可核实声明

读全文，仅从渲染函数中提取以下可量化声明，**跳过主观论点和叙事性段落**：

| 类型 | 提取模式 |
|------|---------|
| 价格 | `¥` `$` `/月` `免费` `Pro` `API Key` 附近的数字 |
| 版本号 | `v\d+\.\d+` `version \d+` |
| API 参数名 | CodeBlock 中的配置字段 |
| 命令语法 | CodeBlock 中的 CLI 命令 |
| 功能声明 | "支持" "不支持" "无法" "可以" "仅" |
| 网络可达性 | "国内直连" "需科学上网" "可直连" |

**不提取**：观点、推荐、叙事描述、历史背景、代码注释。

### 第 3 步：逐条核实

每条最多一次 WebFetch。单篇文章最多 8 次。超时 15s/次。

**核实源路由**：

| 声明涉及 | 核实 URL |
|---------|---------|
| DeepSeek 价格 | WebFetch api-docs.deepseek.com 价格页 |
| Claude Code 版本/参数 | WebFetch docs.anthropic.com 对应文档 |
| Cursor 价格/功能 | WebFetch cursor.com 对应页面 |
| Copilot 价格/功能 | WebFetch github.com/features/copilot |
| Windsurf 价格/功能 | WebFetch codeium.com/windsurf |
| 通用命令语法 | WebFetch 对应工具官方安装文档 |
| 网络可达性 | 已知知识判断 + 标注需人工验证 |

**判定标准**：

| 标记 | 条件 |
|------|------|
| ✅ 一致 | 与官方文档当前版本一致 |
| ⚠️ 已变更 | 与官方文档不一致（附新旧值对比） |
| ⊘ 无法核实 | 找不到权威源、超时、或需要登录才能查看 |

**不确定的不判死。**

### 第 4 步：输出报告

```
📋 事实核实 — <文章标题>
   核实时间：YYYY-MM-DD
   核实条数：N

   ✅ 一致 (N)
      · 版本号 v2.1.15 → changelog 确认
      · winget install Anthropic.ClaudeCode → 官方文档一致

   ⚠️ 需更新 (N)
      · DeepSeek 价格 ¥2/百万 → 官方已调至 ¥1/百万
        位置：<文件:行号>

   ⊘ 无法核实 (N)
      · "国内直连" — 需人工验证

   ───────────────
   可靠度：✅N / ⚠️N / ⊘N
```

## 约束

- 操作等级：L1（读取）+ L2（WebFetch）
- 不修改任何文件，只输出报告
- 单篇最多 8 次 WebFetch
- 不核实观点、推荐、叙事描述
- 不确定不判死（标 ⊘）
