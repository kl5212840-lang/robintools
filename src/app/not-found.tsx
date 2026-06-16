import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">页面未找到</h1>
      <p className="mb-8 text-muted-foreground max-w-md">
        你访问的页面不存在。可能是链接已失效，或该工具指南尚未编写。
      </p>
      <Link href="/">
        <Button variant="outline" className="gap-2 border-border/60">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Button>
      </Link>
    </div>
  );
}
