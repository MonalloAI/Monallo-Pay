import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-center">
        <div className="mr-4 flex ml-24 flex-1">
          <Link href="/event" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">生态跳格子</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 mr-24">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/event/leaderboard">排行榜</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/event/rewards">奖励中心</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
