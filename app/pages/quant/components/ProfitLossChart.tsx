'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfitLossChart() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <CardTitle className="text-base font-medium">利润和损失</CardTitle>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="选择时间段" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">最近7天</SelectItem>
            <SelectItem value="ALL">ALL</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-gray-400 mt-2">
              <div>总收益</div>
              <div className="mt-1">买入 0 LAT | 卖出 0 LAT</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 