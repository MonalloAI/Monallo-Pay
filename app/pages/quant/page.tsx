'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/ui/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusCircle, MoonIcon, SunIcon, PencilIcon, WrenchIcon, SettingsIcon, LayersIcon, ChevronDownIcon } from 'lucide-react'
import { ProfitLossChart } from './components/ProfitLossChart'
import { TradingVolume } from './components/TradingVolume'
import { ProfitDistribution } from './components/ProfitDistribution'
import { ApiSettingsModal } from './components/ApiSettingsModal'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SubscriptionPlans } from './components/SubscriptionPlans'
import { GridBotConfig } from './components/GridBotConfig'
import { ReportPage } from './components/ReportPage'
import { ComingSoonPage } from './components/ComingSoonPage'
import { ComingSoonModal } from './components/ComingSoonModal'

interface SavedApi {
  name: string;
  key: string;
  exchange: string;
}

interface UserSubscription {
  subscription_plan: 'basic' | 'pro' | 'proPlus' | 'premium'
  subscription_type: 'monthly' | 'yearly'
  end_date: string
}

export default function Quant() {
  const [activeTab, setActiveTab] = useState('grid') 
  const [selectedStrategy, setSelectedStrategy] = useState('neutral')
  const [showApiModal, setShowApiModal] = useState(false)
  const [priceMode, setPriceMode] = useState<'monthly' | 'yearly'>('yearly');
  const [savedApis, setSavedApis] = useState<SavedApi[]>([])
  const [editingKeyName, setEditingKeyName] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [gridStep, setGridStep] = useState<'initial' | 'mode' | 'config'>('initial');
  const [selectedMode, setSelectedMode] = useState<'auto' | 'manual' | 'batch'>('auto');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [showAiComingSoon, setShowAiComingSoon] = useState(false)

  // 加载保存的 API
  const loadSavedApis = async () => {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const walletAddress = accounts[0];

      const response = await fetch('/api/trading/getApiKeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedApis(data.data);
      }
    } catch (error) {
      console.error('加载API密钥错误:', error);
      toast.error('加载API密钥失败');
    }
  };

  // 删除 API
  const handleDeleteApi = async (keyName: string) => {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const walletAddress = accounts[0];

      const response = await fetch('/api/trading/deleteApiKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, keyName }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedApis(apis => apis.filter(api => api.name !== keyName));
        toast.success('API密钥删除成功');
      }
    } catch (error) {
      console.error('删除API密钥错误:', error);
      toast.error('删除失败，请重试');
    }
  };

  // 添加更新 API 密钥名称的函数
  const handleUpdateKeyName = async (oldKeyName: string) => {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const walletAddress = accounts[0];

      const response = await fetch('/api/trading/updateApiKeyName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress, 
          oldKeyName, 
          newKeyName 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedApis(apis => apis.map(api => 
          api.name === oldKeyName 
            ? { ...api, name: newKeyName }
            : api
        ));
        setEditingKeyName(null);
        setNewKeyName('');
        toast.success('API密钥名称更新成功');
      }
    } catch (error) {
      console.error('更新API密钥名称错误:', error);
      toast.error('更新失败，请重试');
    }
  };

  // 页面加载时获取 API 列表
  useEffect(() => {
    loadSavedApis();
  }, []);

  // 处理新保存的 API
  const handleSaveApi = (api: SavedApi) => {
    setSavedApis(prev => [...prev, api]);
  };

  // 处理模式选择后的下一步
  const handleModeNext = () => {
    setGridStep('config')
  }

  // 获取用户订阅信息
  const getUserSubscription = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/user/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()
      if (data.success) {
        setUserSubscription(data.data)
      }
    } catch (error) {
      console.error('获取订阅信息错误:', error)
      toast.error('获取订阅信息失败')
    }
  }

  // 连接钱包并获取订阅信息
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        const walletAddress = accounts[0]
        await getUserSubscription(walletAddress)
      } catch (error) {
        console.error('连接钱包失败:', error)
      }
    }

    connectWallet()
  }, [])

  // 处理订阅
  const handleSubscribe = async (plan: 'pro' | 'proPlus' | 'premium', type: 'monthly' | 'yearly') => {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      const walletAddress = accounts[0]

      const response = await fetch('/api/user/subscription/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress,
          plan,
          subscriptionType: type
        }),
      })

      const data = await response.json()
      if (data.success) {
        setUserSubscription(data.data)
        toast.success('订阅更新成功')
      } else {
        toast.error('订阅更新失败')
      }
    } catch (error) {
      console.error('订阅更新错误:', error)
      toast.error('订阅更新失败，请重试')
    }
  }

  // 处理 tab 切换
  const handleTabChange = (tab: string) => {
    if (tab === 'ai') {
      setShowAiComingSoon(true)
    }
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gradient-to-l from-purple-50 to-[#FFFEFF]">
      <Header className="fixed top-0 left-0 right-0 z-50" />
      
      <div className="flex pt-16">
        {/* 固定的侧边栏 */}
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white/80 border-r border-gray-200 p-4">
          <nav className="space-y-2">
          <button 
              onClick={() => setActiveTab('grid')}
              className={`w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg ${activeTab === 'grid' ? 'bg-gray-100' : ''}`}
            >
              网格机器人
            </button>
            <button 
              onClick={() => handleTabChange('ai')}
              className={`w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg ${activeTab === 'ai' ? 'bg-gray-100' : ''}`}
            >
              AI网格机器人
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg ${activeTab === 'report' ? 'bg-gray-100' : ''}`}
            >
              报告
            </button>
            <button 
              onClick={() => setActiveTab('history-database')}
              className={`w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg ${activeTab === 'history-database ' ? 'bg-gray-100' : ''}`}
            >
              历史行情数据库
            </button>
            <button 
              onClick={() => setActiveTab('subscription')}
              className={`w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg ${activeTab === 'subscription' ? 'bg-gray-100' : ''}`}
            >
              订阅方案
            </button>
          </nav>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 ml-64 overflow-auto scrollbar-hide">
          {/* 固定的次级头部 */}
          <div className="fixed top-16 left-64 right-0 h-16  border-gray-200 flex items-center justify-end px-6 bg-white/70 z-40">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <SunIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 可滚动的内容区域 */}
          <main className="pt-16 p-8">
            <div className="max-w-[1400px] mx-auto">
              {activeTab === 'report' || activeTab === 'history-database' ? (
                <ComingSoonPage />
              ) : activeTab === 'ai' ? (
                <>
                  {/* <div className="bg-orange-100 text-orange-800 p-4 rounded-lg mb-8 max-w-[1400px]">
                     Bot目前还只提供测试，确保安全第一的实践，在这个不安的数字上工作， Bot将通过展示，通过先进的人工智能技术和网格策略，它能够稳定获得超过30%年化收益率，AI Grid Bot即将揭晓！
                  </div> */}

                  <div className="mb-8 max-w-[1400px]">
                    <h1 className="text-2xl font-semibold mb-6 text-gray-800">创建AI Grid机器人</h1>
                    
                    <Card className="bg-white border-gray-200">
                      <CardContent className="p-6 space-y-8 max-w-[1400px]">
                        <div>
                          <h2 className="text-lg font-medium mb-4 text-gray-800">交易所API</h2>
                          <Button variant="outline" className="border-dashed border-gray-700 text-gray-400">
                            + 添加交易所 API
                          </Button>
                        </div>

                        <div>
                          <h2 className="text-lg font-medium mb-4 text-gray-800">模式</h2>
                          <div className="p-4 border border-pink-300 rounded-lg bg-pink-50">
                            <h3 className="font-medium mb-2 text-gray-800">智能加密货币ETF</h3>
                            <div className="text-sm text-gray-400 space-y-1">
                              <p>(AI投资策略市场杠杆化交易)</p>
                              <p>• Basic & Pro计划量化交易服务</p>
                              <p>• Pro+ & Premium计划量化交易服务+BTCUSDT</p> 
                              <p>* 直至2024/12/31年的0%月度使用费率</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-lg font-medium mb-4 text-gray-800">杠杆</h2>
                          <RadioGroup defaultValue="1x">
                            <div className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1x" id="1x" />
                                <Label htmlFor="1x">1x - 安全</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2x" id="2x" />
                                <Label htmlFor="2x">2x - 稳健性</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3x" id="3x" />
                                <Label htmlFor="3x">3x - 风险</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                        
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : activeTab === 'grid' ? (
                <GridBotConfig 
                  savedApis={savedApis}
                  selectedApi={selectedApi}
                  setSelectedApi={setSelectedApi}
                  setShowApiModal={setShowApiModal}
                  gridStep={gridStep}
                  setGridStep={setGridStep}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  isAdvancedOpen={isAdvancedOpen}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                  editingKeyName={editingKeyName}
                  setEditingKeyName={setEditingKeyName}
                  newKeyName={newKeyName}
                  setNewKeyName={setNewKeyName}
                  handleDeleteApi={handleDeleteApi}
                  handleUpdateKeyName={handleUpdateKeyName}
                />
              ) : activeTab === 'subscription' ? (
                <SubscriptionPlans 
                  currentPlan={userSubscription?.subscription_plan || 'basic'}
                  currentSubscription={{
                    plan: userSubscription?.subscription_plan,
                    type: userSubscription?.subscription_type,
                    price: userSubscription?.price
                  }}
                  onSubscriptionUpdate={getUserSubscription}
                />
              ) : null}
            </div>
          </main>
        </div>
      </div>

      <ApiSettingsModal 
        isOpen={showApiModal} 
        onClose={() => setShowApiModal(false)}
        onSaveApi={handleSaveApi}
      />

      <ComingSoonModal 
        isOpen={showAiComingSoon}
        onClose={() => setShowAiComingSoon(false)}
      />
    </div>
  )
}
