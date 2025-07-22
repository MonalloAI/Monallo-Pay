'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ProfitDistribution() {
  return (
    <Card className="w-full relative overflow-hidden">
      {/* 毛玻璃遮罩层 */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10 flex items-center justify-center">
        <div className="text-3xl font-bold text-gray-800/80">
          Coming Soon
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-base font-medium">交易历史</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm">暂无数据</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 