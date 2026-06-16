import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderSparkTroubleshoot(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
        GitHub Spark 使用过程中的常见问题。按问题类型分为生成结果、部署、限制配额三类。如果未覆盖你的问题，可查阅 GitHub 官方文档 Spark 章节。
      </p>

      <h2 id="section-ts-generation"><span className="step-badge">1</span>生成结果不符合预期</h2>
      <div className="space-y-4">
        <ProblemCard title="生成的页面完全不是我要的" desc="描述了一个工具页面但 Spark 生成的东西跟描述差很远。" solution="① 回顾你的 Prompt 是否包含四要素（角色+功能+样式+约束）——缺少样式描述时 Spark 用默认样式，可能和预期差异大；② 描述是否太抽象——'做一个好看的管理面板'太模糊，试试'三列卡片布局、左侧导航栏、深色主题'；③ 删除这次生成重新来——全新 Prompt 通常比反复修一个走偏的方向更高效。" />
        <ProblemCard title="样式细节总是不对" desc="布局思路对但颜色、间距、字体等细节跟描述不一致。" solution="① 用具体的 CSS 值而不是模糊描述——'蓝色'不如'#2563EB'，'圆角'不如'border-radius 12px'；② 样式描述放在 Prompt 末尾——Spark 倾向于对靠后的指令有更高的执行权重；③ 分步骤迭代——先说布局，布局调好再说颜色；④ 如果 Spark 一直不执行某个样式指令，换一种表述（如'make the button bigger'换成'enlarge the submit button to 48px height'）。" />
        <ProblemCard title="Spark 只实现了部分功能" desc="描述中有 5 个功能点，Spark 只做了 2-3 个。" solution="① Prompt 中的功能点是否按优先级排列？Spark 在处理长 Prompt 时可能只执行前半部分——把最重要的功能放前面；② 每条功能用独立句子写——逗号连接的多个需求容易被合并或忽略；③ 复杂功能拆成多轮迭代——第一轮实现核心功能，第二轮追加额外功能，不要一口气全塞进去；④ 如果某个功能一直不出现，单独开一轮迭代只提这一个要求。" />
        <ProblemCard title="迭代修改后旧功能坏了" desc="让 Spark 加了一个新功能，结果之前正常的功能出问题了。" solution="这是 AI 生成代码的常见问题——局部改动可能影响全局。① 在迭代指令末尾加'只改我要求的部分，不要改动其他已经正常的功能'；② 如果坏得严重，回到上一个可用的版本（Spark 通常保留历史版本），重新迭代；③ 导出代码到本地编辑器后手动调整——复杂应用建议导出后继续开发。" />
      </div>

      <h2 id="section-ts-deploy"><span className="step-badge">2</span>部署失败</h2>
      <div className="space-y-4">
        <ProblemCard title="点 Deploy 后一直转圈" desc="点击部署按钮后长时间加载，没有完成。" solution="① 检查 GitHub 状态页面（githubstatus.com）确认服务正常；② 刷新页面后重试——有时前端状态异常导致部署请求未发出；③ 检查生成的应用是否包含大量图片或超大文件——这会导致构建时间变长；④ 如果超过 5 分钟没响应，关闭标签页重新打开 Spark 仪表板，应用应该还在，重新部署。" />
        <ProblemCard title="部署成功后链接 404" desc="拿到了 URL 但访问时显示 404 Not Found。" solution="① 部署后等 1-2 分钟再访问——CDN 分发需要时间生效；② 确认链接是否完整复制（末尾没有多或少字符）；③ 回到 Spark 仪表板确认应用状态是否显示为'已部署'——如果不是，重新部署；④ 免费版部署可能有临时链接有效期，检查是否已过期。" />
        <ProblemCard title="部署的应用移动端显示有问题" desc="电脑上看正常，手机上布局错乱或内容截断。" solution="① 在 Prompt 中明确要求'移动端优先设计'或'响应式布局'；② 迭代时补充指令：'让这个应用在手机上也能正常使用'；③ 导出代码后用浏览器 DevTools 的移动端模拟器检查具体哪个元素溢出了，然后针对性地给 Spark 修正指令；④ 复杂移动端适配建议导出后手动微调。" />
        <ProblemCard title="企业用户无法部署" desc="组织成员的 Deploy 按钮灰色无法点击。" solution="① 联系你的 GitHub 组织管理员——管理员在 Organization Settings → Copilot → Spark 中控制部署权限；② 管理员可能限制了部署目标（如仅允许组织 Pages），你的应用不符合配置的目标条件；③ 有些企业禁用了 Spark 的公开部署功能，只能部署到内部域名。" />
      </div>

      <h2 id="section-ts-limit"><span className="step-badge">3</span>限制与配额</h2>
      <div className="space-y-4">
        <ProblemCard title="免费版能生成几个应用" desc="不知道免费版的限制是什么，怕超了。" solution="GitHub Spark 在不同套餐下的访问权限和用量限制由 GitHub 逐步调整。① 查看 github.com/settings/billing 确认你当前的套餐；② GitHub 官方文档的 Spark 章节有最新配额说明；③ 免费版通常允许创建有限数量的 Spak（提示词→应用的一次生成），超出后需等待重置或升级套餐；④ 已部署的应用不受配额影响——配额只控制生成新应用的次数。" />
        <ProblemCard title="生成速度突然变慢" desc="之前十几秒出结果，现在要等几分钟。" solution="① 检查是否是 GitHub 服务器高峰时段（美国工作时间通常较慢）；② 你的 Prompt 是否比之前长很多——更长的 Prompt 需要更多处理时间；③ 网络延迟——国内访问 GitHub 在某些时段可能较慢，稍后再试；④ 如果持续太慢，尝试拆分复杂需求为多个简单步骤，每次生成更快。" />
        <ProblemCard title="应用导出后代码风格不一致" desc="同一个应用导出后，不同文件中的写法风格不同。" solution="① Spark 生成代码时可能混合了不同的模式——导出后这是正常的，需要人工统一；② 导出前在 Prompt 中加入代码风格约束——'所有按钮用同样的 class，不要写内联样式'——这样生成的代码会更统一；③ 建议导出后用 Prettier 或 ESLint 统一格式。" />
      </div>

      <FreshnessNote>以上配额和限制信息验证于 2026-06，具体限制可能随 GitHub 政策调整。</FreshnessNote>

      <Collapsible summary="通用验证：问题是否已修复">
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li>部署问题 → 点击 Deploy 后等待 30 秒，在无痕窗口打开 URL 确认 200 OK</li>
          <li>生成问题 → 用同样的 Prompt 重新生成一次，对比新旧版本的差异</li>
          <li>导出问题 → 导出后在本地用 VS Code 打开，确认所有文件存在且格式正确</li>
        </ol>
      </Collapsible>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如果上述方案未能解决你的问题，可查阅 GitHub 官方文档中 Spark 的专门章节。
      </p>
    </div>
  );
}

export default renderSparkTroubleshoot;
