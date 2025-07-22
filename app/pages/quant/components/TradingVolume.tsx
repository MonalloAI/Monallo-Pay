'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TradingVolume() {
  return (
    <Card className="w-full relative overflow-hidden">
      {/* 毛玻璃遮罩层 */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10 flex items-center justify-center">
        <div className="text-3xl font-bold text-gray-800/80">
          Coming Soon
        </div>
      </div>

      <CardHeader className="p-6">
        <CardTitle className="text-base font-medium">每日盈亏</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-gray-400 mt-2">
              <div>今日收益</div>
              <div className="mt-1">较昨日 +0%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 