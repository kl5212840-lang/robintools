import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderSparkTutorial(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        本教程带你走完一个完整流程——从想法到部署一个可用的 Web 应用。前提：你已能访问 GitHub Spark（详见「安装指南」）。
      </p>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>从想法到应用：完整流程</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        用一个真实例子演示——创建一个"个人阅读清单"应用。
      </p>

      <h3>第一步：写初始 Prompt</h3>
      <CodeBlock language="text" mode="unified" code={`创建一个个人阅读清单工具：
角色：给我自己用，跟踪想看的书和阅读进度
功能：
  - 顶部有一个搜索框，可以按书名搜索
  - 默认显示我添加的所有书，每本书一张卡片
  - 每张卡片显示：书名、作者、封面图占位、阅读状态（未开始/在读/已读完）
  - 点击"添加新书"按钮，弹出一个表单：书名、作者、阅读状态
  - 可以修改每本书的阅读状态
样式：
  - 像 Goodreads 那样的简洁书单风格
  - 米色/象牙白背景，深棕色文字
  - 卡片横向排列，每行 3 张（桌面端）
  - 手机端每行 1 张
约束：
  - 数据存 localStorage
  - 不需要登录`} />

      <h3>第二步：审查并迭代</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        生成后逐一确认每个功能点是否实现，然后逐条精调。
      </p>
      <CodeBlock language="text" code={`# 迭代 1：调布局
# 预览后发现卡片竖向排列——改成网格
> 卡片改成三列网格布局，每列等宽，卡片之间间距 20px

# 迭代 2：加功能
# 卡片上没有封面图占位——加上
> 每张卡片上方加一个灰色占位区域用来放封面图，高度 180px，显示"暂无封面"文字

# 迭代 3：调交互
# 状态切换不够直观——加上下拉框
> 阅读状态从纯文字改成下拉选择框，三个选项：未开始、在读、已读完

# 迭代 4：修细节
# 添加新书后没有反馈
> 点"添加新书"提交成功后，弹一个绿色成功提示"已添加"，2 秒后自动消失`} />

      <h3>第三步：部署</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        满意后点击 Deploy（约 10-30 秒），拿到链接分享给别人。
      </p>

      <Collapsible summary="验证：完整流程自检">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>教程结束后逐条确认：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li>访问生成的阅读列表链接 → 添加一本书 → 确认列表更新</li>
          <li>继续迭代一次 → 在 Success Message 中输入"改成三列卡片布局" → Spark 应生成新版本</li>
          <li>导出代码到 GitHub 仓库 → 检查仓库文件结构完整（至少应有 index.html 和样式文件）</li>
        </ol>
      </Collapsible>

      <Callout type="info">
        <strong>迭代节奏</strong>：每轮迭代控制在一条指令内，确认效果后再下一条。多条指令一次发送 = 调试困难，你不知道是哪条出了问题。
      </Callout>

      <h2 id="section-tutorial-styling"><span className="step-badge">2</span>样式与 UI 定制</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Spark 接受 CSS 级别的精确描述——你不需要写代码，但懂 CSS 能大幅提升效果。
      </p>

      <h3>有效的样式指令</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>你要的效果</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>Spark 能理解的指令</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>主题切换</strong></td>
              <td className="py-2">"加一个深色/浅色模式切换按钮，右上角太阳/月亮图标"</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>渐变背景</strong></td>
              <td className="py-2">"背景从蓝色渐变到紫色，从上到下，斜向 45 度"</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>响应式设计</strong></td>
              <td className="py-2">"桌面端三列，平板两列，手机一列"</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>毛玻璃效果</strong></td>
              <td className="py-2">"导航栏用毛玻璃效果：半透明背景 + backdrop-blur 10px"</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>加载动画</strong></td>
              <td className="py-2">"页面加载时显示一个旋转的加载指示器，加载完成后淡入内容"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        <strong>CSS 术语加成</strong>：如果你会 CSS，直接用术语（border-radius、box-shadow、transition、grid、flexbox、z-index）——Spark 会准确执行。不会的话描述效果，Spark 选最接近的方案。
      </Callout>

      <h2 id="section-tutorial-data"><span className="step-badge">3</span>数据与状态管理</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Spark 生成的应用默认用浏览器 localStorage 存数据——页面刷新后数据还在，但换设备就没有。以下是常用数据场景的处理方式。
      </p>

      <h3>本地存储（默认）</h3>
      <CodeBlock language="text" code={`# Prompt 中指定存储方式
> 用户添加的所有书单存在本地浏览器，不需要登录，不需要服务器

# Spark 自动用 localStorage 实现，无需额外配置`} />

      <h3>数据导入/导出</h3>
      <CodeBlock language="text" code={`# 添加导入导出功能
> 加一个"导出数据"按钮，把所有书单导出为 JSON 文件下载
> 加一个"导入数据"按钮，可以上传之前导出的 JSON 文件恢复数据`} />

      <h3>与其他工具的区别</h3>
      <Callout type="info">
        <strong>Spark 不是后端框架</strong>：它生成的是前端应用（HTML/CSS/JS）。如果你需要服务器端数据库、用户认证、后端 API——Spark 不适合。导出代码后，你可以手动对接 Firebase、Supabase 等后端服务。
      </Callout>

      <h2 id="section-tutorial-advanced"><span className="step-badge">4</span>进阶场景</h2>

      <h3>AI 功能集成</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Spark 可以在生成的应用中嵌入 AI 能力——让应用本身具备智能功能。
      </p>
      <CodeBlock language="text" code={`# 带 AI 功能的应用
> 创建一个写作辅助工具：
> - 用户输入一段文字
> - 点击"润色"按钮，AI 自动改写为更流畅的表达
> - 点击"摘要"按钮，AI 生成 100 字以内的摘要
> - 结果显示在输入框下方

# Spark 会生成包含 AI API 调用的应用（需要 GitHub Copilot 订阅）`} />
      <FreshnessNote>以上 AI 功能依赖和订阅要求验证于 2026-06。</FreshnessNote>

      <h3>模板复用</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        做好一个应用后，你可以用它的 Prompt 做模板，修改几个关键词生成类似的应用：
      </p>
      <CodeBlock language="text" code={`# 原模板 Prompt（换成对应部分即可）
创建一个 [用途] 管理工具：
角色：[目标用户]
功能：[列出 3-5 个核心功能]
样式：[颜色、布局、风格描述]
约束：[存储方式、不需要的功能]

# 示例：把"个人阅读清单"改成"电影待看清单"
# 把"书名"换成"电影名"、把"作者"换成"导演"——其他结构不变`} />

      <Callout type="info">
        <strong>总结</strong>：GitHub Spark 填补了&ldquo;零代码做应用&rdquo;的空缺。它不是为了取代传统开发，而是让非开发者和开发者的 prototype 阶段都有更快的方式。经验法则：7 天内能用手写实现的功能，Spark 可以生成 80%；更复杂的长期项目，Spark 做原型、导出代码、继续手写开发。
      </Callout>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        更多灵感可查看 GitHub 官方博客的 Spark 示例合集。
      </p>
    </div>
  );
}

export default renderSparkTutorial;
