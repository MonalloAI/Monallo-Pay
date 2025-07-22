'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { WrenchIcon, SettingsIcon, LayersIcon, ChevronDownIcon, PencilIcon } from 'lucide-react'
import Image from 'next/image'
import { ComingSoonModal } from './ComingSoonModal'

interface GridBotConfigProps {
  savedApis: any[]
  selectedApi: string
  setSelectedApi: (value: string) => void
  setShowApiModal: (value: boolean) => void
  gridStep: 'initial' | 'mode' | 'config'
  setGridStep: (value: 'initial' | 'mode' | 'config') => void
  selectedMode: 'auto' | 'manual' | 'batch'
  setSelectedMode: (value: 'auto' | 'manual' | 'batch') => void
  isAdvancedOpen: boolean
  setIsAdvancedOpen: (value: boolean) => void
  editingKeyName: string | null
  setEditingKeyName: (value: string | null) => void
  newKeyName: string
  setNewKeyName: (value: string) => void
  handleDeleteApi: (keyName: string) => void
  handleUpdateKeyName: (oldKeyName: string) => void
}

export function GridBotConfig({
  savedApis,
  selectedApi,
  setSelectedApi,
  setShowApiModal,
  gridStep,
  setGridStep,
  selectedMode,
  setSelectedMode,
  isAdvancedOpen,
  setIsAdvancedOpen,
  editingKeyName,
  setEditingKeyName,
  newKeyName,
  setNewKeyName,
  handleDeleteApi,
  handleUpdateKeyName
}: GridBotConfigProps) {
  const [showComingSoon, setShowComingSoon] = useState(false)

  // 处理模式选择后的下一步
  const handleModeNext = () => {
    setShowComingSoon(true)
  }

  return (
    <div className="grid gap-4">
      {gridStep === 'initial' ? (
        <>
          <Card className="bg-gradient-to-l from-[#FFFEFF] to-purple-50">
            <Button
              onClick={() => setShowApiModal(true)}
              className="absolute top-4 right-4 bg-transparent border border-dashed border-gray-500 hover:border-gray-700 text-gray-500 hover:text-gray-700"
            >
              + 添加交易所 API
            </Button>

            <CardHeader>
              <CardTitle>建立网格交易机器人</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 交易所 API 部分 */}
              <div className="space-y-4">
                <div className="text-lg font-medium">交易所API</div>
                {savedApis.length > 0 ? (
                  <Select 
                    value={selectedApi} 
                    onValueChange={setSelectedApi}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {selectedApi ? (
                          <div className="flex items-center space-x-2">
                            <Image 
                              src="/hplogo.png" 
                              alt="HYPERLIQUID" 
                              width={20} 
                              height={20}
                            />
                            <span>HYPERLIQUID</span>
                            <span className="text-gray-500">{
                              savedApis.find(api => api.name === selectedApi)?.name
                            }</span>
                          </div>
                        ) : (
                          "选择 API"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {savedApis.map((api) => (
                        <SelectItem key={api.name} value={api.name}>
                          <div className="flex items-center space-x-2">
                            <Image 
                              src="/hplogo.png" 
                              alt="HYPERLIQUID" 
                              width={20} 
                              height={20}
                            />
                            <span>HYPERLIQUID</span>
                            <span className="text-gray-500">{api.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Button
                    onClick={() => setShowApiModal(true)}
                    className="bg-transparent border border-dashed border-gray-500 hover:border-gray-700 text-gray-500 hover:text-gray-700"
                  >
                    + 添加交易所 API
                  </Button>
                )}
              </div>

              {/* 市场类型选择 */}
              <div className="mt-6 space-y-4">
                <div className="text-lg font-medium">市场类型</div>
                <RadioGroup defaultValue="spot">
                  <div>
                    <RadioGroupItem
                      value="spot"
                      id="spot"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="spot"
                      className="flex items-center space-x-4 rounded-lg border-2 transition-all duration-200 
                        peer-data-[state=checked]:border-[#E4427D] peer-data-[state=checked]:bg-[#E4427D]/10
                        peer-data-[state=unchecked]:border-gray-200 peer-data-[state=unchecked]:opacity-50
                        bg-transparent p-6 cursor-pointer hover:bg-[#E4427D]/5 w-full"
                    >
                      <div className="flex-grow">
                        <div className="font-medium text-lg">现货</div>
                        <div className="text-gray-500 italic">使用现货市场进行网格交易</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 下一步按钮 */}
              <div className="mt-6 flex justify-center">
                <Button 
                  className="bg-[#E4427D] hover:bg-[#E4427D]/90 text-white px-8"
                  disabled={savedApis.length === 0}
                  onClick={() => setGridStep('mode')}
                >
                  下一步
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API 信息显示 */}
          {savedApis.map((api, index) => (
            <div 
              key={index}
              className="bg-[#1A1F2D] p-4 rounded-lg text-white space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#00D98B]">{api.exchange}</span>
                </div>
                <button 
                  className="text-white hover:text-gray-300"
                  onClick={() => handleDeleteApi(api.name)}
                >
                  删除
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>API密钥名称: </span>
                  {editingKeyName === api.name ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="bg-transparent border-gray-600 text-white w-48"
                        placeholder="输入新名称"
                      />
                      <Button
                        onClick={() => handleUpdateKeyName(api.name)}
                        className="bg-[#E4427D] hover:bg-[#E4427D]/90 text-white px-2 py-1 text-sm"
                      >
                        保存
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingKeyName(null);
                          setNewKeyName('');
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 text-sm"
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{api.name}</span>
                      <button
                        onClick={() => {
                          setEditingKeyName(api.name);
                          setNewKeyName(api.name);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>交易所API key: {api.key}</div>
              </div>
            </div>
          ))}

          {/* 免责声明 */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-800">免责声明</h2>
              <p className="text-sm text-gray-400">
                由交易机器人所获得的利润并不保证且会因市场情况而改变。有关更多信息，请查看我们的使用条款中的风险免责声明部分
              </p>
            </CardContent>
          </Card>
        </>
      ) : gridStep === 'mode' ? (
        <Card className="bg-gradient-to-l from-[#FFFEFF] to-purple-50">
          <CardHeader>
            <CardTitle>建立网格交易机器人：现货网格</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-lg font-medium">机器人创建模式</div>
              <RadioGroup 
                defaultValue="auto" 
                value={selectedMode}
                onValueChange={(value) => setSelectedMode(value as 'auto' | 'manual' | 'batch')}
                className="grid grid-cols-1 gap-4"
              >
                {/* 自动模式 */}
                <div>
                  <RadioGroupItem
                    value="auto"
                    id="auto"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="auto"
                    className="flex items-center space-x-4 rounded-lg border-2 transition-all duration-200 
                      peer-data-[state=checked]:border-[#E4427D] peer-data-[state=checked]:bg-[#E4427D]/10
                      peer-data-[state=unchecked]:border-gray-200 peer-data-[state=unchecked]:opacity-50
                      bg-transparent p-6 cursor-pointer hover:bg-[#E4427D]/5"
                  >
                    <div className="flex-shrink-0">
                      <WrenchIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-lg">自动</div>
                      <div className="text-gray-500 italic">默认配置，适用于新用户</div>
                    </div>
                  </Label>
                </div>

                {/* 手动模式 */}
                <div>
                  <RadioGroupItem
                    value="manual"
                    id="manual"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="manual"
                    className="flex items-center space-x-4 rounded-lg border-2 transition-all duration-200 
                      peer-data-[state=checked]:border-[#E4427D] peer-data-[state=checked]:bg-[#E4427D]/10
                      peer-data-[state=unchecked]:border-gray-200 peer-data-[state=unchecked]:opacity-50
                      bg-transparent p-6 cursor-pointer hover:bg-[#E4427D]/5"
                  >
                    <div className="flex-shrink-0">
                      <SettingsIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-lg">手动</div>
                      <div className="text-gray-500 italic">自定义配置，供有经验的用户使用</div>
                    </div>
                  </Label>
                </div>

                {/* 批量模式 */}
                <div>
                  <RadioGroupItem
                    value="batch"
                    id="batch"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="batch"
                    className="flex items-center space-x-4 rounded-lg border-2 transition-all duration-200 
                      peer-data-[state=checked]:border-[#E4427D] peer-data-[state=checked]:bg-[#E4427D]/10
                      peer-data-[state=unchecked]:border-gray-200 peer-data-[state=unchecked]:opacity-50
                      bg-transparent p-6 cursor-pointer hover:bg-[#E4427D]/5"
                  >
                    <div className="flex-shrink-0">
                      <LayersIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-lg">批量</div>
                      <div className="text-gray-500 italic">同时创建多个机器人，专门供专家使用</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => setGridStep('initial')}
              >
                返回
              </Button>
              <Button 
                className="bg-[#E4427D] hover:bg-[#E4427D]/90 text-white px-8"
                onClick={handleModeNext}
              >
                下一步
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-l from-[#FFFEFF] to-purple-50">
          <CardHeader>
            <CardTitle>建立网格交易机器人：现货网格</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMode === 'auto' && (
              <div className="space-y-6">
                {/* 交易对选择 */}
                <div>
                  <div className="text-lg font-medium mb-4">交易对</div>
                  <Select>
                    <SelectTrigger className="w-full bg-[#1A1F2D] text-white border-none h-12">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2D] text-white border-none">
                      <SelectItem value="hype-usdc">HYPE/USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 参数显示 */}
                <div>
                  <div className="text-lg font-medium mb-4">参数</div>
                  <div className="bg-[#1A1F2D] p-4 rounded-lg text-white">
                    <div className="space-y-2">
                      <div>价格范围: --</div>
                      <div>网格: --</div>
                      <div>利润/网格: --</div>
                    </div>
                  </div>
                </div>

                {/* 投资金额 */}
                <div>
                  <div className="text-lg font-medium mb-4">投资金额</div>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value="606"
                      className="bg-[#1A1F2D] text-white border-none h-12 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                      USDT
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    最低投资: USDT
                  </div>
                  <div className="flex items-center mt-4">
                    <Checkbox id="auto-invest" />
                    <label htmlFor="auto-invest" className="ml-2 text-sm text-gray-600">
                      自动在推荐时间购买: USD
                    </label>
                  </div>
                </div>

                {/* 每笔订单的数量 */}
                <div>
                  <div className="text-lg font-medium mb-4">每笔订单的数量</div>
                  <Input 
                    placeholder="每格交易的币数量"
                    className="bg-[#1A1F2D] text-white border-none h-12"
                  />
                </div>

                {/* 进阶设置 */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    className="w-full flex items-center justify-between text-lg font-medium py-2"
                  >
                    <span>进阶设置（可选）</span>
                    <ChevronDownIcon 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isAdvancedOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* 进阶设置内容 */}
                  {isAdvancedOpen && (
                    <div className="space-y-6">
                      {/* 机器人名称 */}
                      <div>
                        <div className="text-lg font-medium mb-4">机器人名称</div>
                        <Input 
                          placeholder="HPYH/USDC_现货网格_Auto"
                          className="bg-[#1A1F2D] text-white border-none h-12"
                        />
                      </div>

                      {/* 最大挂单数 */}
                      <div>
                        <div className="text-lg font-medium mb-4">最大挂单数</div>
                        <Input 
                          type="number"
                          defaultValue="1"
                          className="bg-[#1A1F2D] text-white border-none h-12"
                        />
                        <div className="text-sm text-gray-500 mt-2">
                          每次挂单1个，出单订单1个（最多：3）
                        </div>
                      </div>

                      {/* 网格种类 */}
                      <div>
                        <div className="text-lg font-medium mb-4">网格种类</div>
                        <Select defaultValue="arithmetic">
                          <SelectTrigger className="w-full bg-[#1A1F2D] text-white border-none h-12">
                            <SelectValue placeholder="等差网格" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1F2D] text-white border-none">
                            <SelectItem value="arithmetic">等差网格</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="text-sm text-gray-500 mt-2">
                          每个网格之间的差价相同
                        </div>
                      </div>

                      {/* 订单数量比率 */}
                      <div>
                        <div className="text-lg font-medium mb-4">订单数量比率</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <Input 
                              type="number"
                              defaultValue="100"
                              className="bg-[#1A1F2D] text-white border-none h-12 pr-16"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                              (买)%
                            </div>
                          </div>
                          <div className="relative">
                            <Input 
                              type="number"
                              defaultValue="100"
                              className="bg-[#1A1F2D] text-white border-none h-12 pr-16"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                              (卖)%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 按钮组 */}
            <div className="flex justify-center space-x-4 mt-8">
              <Button 
                variant="outline"
                onClick={() => setGridStep('mode')}
                className="px-8"
              >
                返回
              </Button>
              <Button 
                className="bg-[#E4427D] hover:bg-[#E4427D]/90 text-white px-8"
              >
                创建
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  )
} 