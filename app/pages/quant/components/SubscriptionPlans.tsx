'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubscriptionConfirm } from "./SubscriptionConfirm"

const PRICING_DATA = {
  monthly: {
    pro: {
      price: 14.99,
      discount: '25%',
    },
    proPlus: {
      price: 29.99,
      discount: '25%',
    },
    premium: {
      price: 59.99,
      discount: '25%',
    }
  },
  yearly: {
    pro: {
      price: 9.99,
      yearlyPrice: 119.88,
      discount: '50%',
      savings: 60
    },
    proPlus: {
      price: 19.99,
      yearlyPrice: 239.88,
      discount: '50%',
      savings: 120
    },
    premium: {
      price: 39.99,
      yearlyPrice: 479.88,
      discount: '50%',
      savings: 240
    }
  }
}

interface UserSubscription {
  plan: 'basic' | 'pro' | 'proPlus' | 'premium'
  type: 'monthly' | 'yearly'
  price: number
}

interface SubscriptionPlansProps {
  currentPlan: 'basic' | 'pro' | 'proPlus' | 'premium'
  currentSubscription?: UserSubscription
  onSubscriptionUpdate: (walletAddress: string) => Promise<void>
}

export function SubscriptionPlans({ 
  currentPlan, 
  currentSubscription,
  onSubscriptionUpdate 
}: SubscriptionPlansProps) {
  const [isAnnual, setIsAnnual] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'proPlus' | 'premium'>('pro')
  const pricing = isAnnual ? PRICING_DATA.yearly : PRICING_DATA.monthly

  // 获取当前方案的显示名称
  const getCurrentPlanName = (plan: string) => {
    return plan === 'proPlus' ? 'Pro+' : plan.charAt(0).toUpperCase() + plan.slice(1)
  }

  const handleSubscriptionSuccess = async () => {
    setShowConfirm(false) // 关闭确认页面
    // 刷新当前订阅状态
    if (typeof window !== 'undefined' && window.ethereum) {
      await onSubscriptionUpdate(window.ethereum.selectedAddress)
    }
  }

  if (showConfirm) {
    return (
      <SubscriptionConfirm 
        onBack={() => setShowConfirm(false)} 
        selectedPlan={selectedPlan}
        onSubscriptionSuccess={handleSubscriptionSuccess}
      />
    )
  }

  const handleSubscribe = (plan: 'pro' | 'proPlus' | 'premium') => {
    setSelectedPlan(plan)
    setShowConfirm(true)
  }

  // 获取当前方案的价格
  const getCurrentPlanPrice = () => {
    // 如果是当前方案，返回用户实际订阅的价格
    if (currentSubscription) {
      switch (currentPlan) {
        case 'basic':
          return '0.00'
        case 'pro':
          // 根据用户的实际订阅类型显示价格
          return currentSubscription.type === 'yearly' ? '9.99' : '14.99'
        case 'proPlus':
          return currentSubscription.type === 'yearly' ? '19.99' : '29.99'
        case 'premium':
          return currentSubscription.type === 'yearly' ? '39.99' : '59.99'
        default:
          return '0.00'
      }
    }

    // 如果没有订阅信息，使用默认价格
    switch (currentPlan) {
      case 'basic':
        return '0.00'
      case 'pro':
        return isAnnual ? '9.99' : '14.99'
      case 'proPlus':
        return isAnnual ? '19.99' : '29.99'
      case 'premium':
        return isAnnual ? '39.99' : '59.99'
      default:
        return '0.00'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-l from-purple-50 to-[#FFFEFF] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">方案价格</h1>
          <p className="text-gray-400 mb-4">选择您喜欢的方案，开始自动投资</p>
          <div className="bg-orange-500 text-white rounded-full py-2 px-4 inline-block mb-8">
            <span>每年可以打7折，相当于4个月免费</span>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center gap-2 mb-12">
          <div className="bg-white rounded-lg inline-flex border border-gray-100 shadow-sm">
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg ${
                isAnnual 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              每年
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg ${
                !isAnnual 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              每月
            </button>
          </div>
        </div>

        {/* Basic Plan - 只在当前方案是 basic 时显示 */}
        {currentPlan === 'basic' && (
          <Card className="bg-white border border-gray-100 shadow-lg mb-3">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      $0.00<span className="text-sm text-gray-600">/月</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    当前方案
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Plan - 显示用户当前订阅的方案 */}
        {currentPlan !== 'basic' && (
          <Card className="bg-white border border-gray-100 shadow-lg mb-3">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {getCurrentPlanName(currentPlan)}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${getCurrentPlanPrice()}
                      <span className="text-sm text-gray-600">/月</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    当前方案
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Pro Plan */}
          <Card className="bg-white border border-gray-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-gray-900">Pro</h3>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    -{pricing.pro.discount} off
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${isAnnual ? '9.99' : '14.99'}<span className="text-sm text-gray-900">/月</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-600">$119.88/年</div>
                  )}
                </div>
              </div>
              
              {isAnnual && (
                <div className="bg-purple-50 rounded-full px-4 py-2 text-sm mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  你一年可以省T${pricing.pro.savings}
                </div>
              )}

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 mb-6"
                onClick={() => handleSubscribe('pro')}
                disabled={currentPlan === 'pro'}
              >
                {currentPlan === 'pro' ? '当前方案' : '立即订阅'}
              </Button>

              <div className="space-y-3 text-gray-600">
                <div>• 5 网站机器人</div>
                <div>• 2 AI 交易机器人</div>
                <div>• AI 交易机器人每个机器人的最大总投资额为3,000 美元</div>
                <div>• 低订单优先排序</div>
                <div>• 零交易手续费</div>
              </div>
            </CardContent>
          </Card>

          {/* Pro+ Plan */}
          <Card className="bg-white border border-gray-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-gray-900">Pro+</h3>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    -{pricing.proPlus.discount} off
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${pricing.proPlus.price}<span className="text-sm text-gray-900">/月</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-600">${pricing.proPlus.yearlyPrice}/年</div>
                  )}
                </div>
              </div>
              
              {isAnnual && (
                <div className="bg-purple-50 rounded-full px-4 py-2 text-sm mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  你一年可以省T${pricing.proPlus.savings}
                </div>
              )}

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 mb-6"
                onClick={() => handleSubscribe('proPlus')}
                disabled={currentPlan === 'proPlus'} // 如果是当前方案则禁用
              >
                {currentPlan === 'proPlus' ? '当前方案' : '立即订阅'}
              </Button>

              <div className="space-y-3 text-gray-600">
                <div>• 10 网站机器人</div>
                <div>• 2 AI 交易机器人</div>
                <div>• AI 交易机器人每个机器人的最大总投资额为6,000 美元</div>
                <div>• 高订单优先排序</div>
                <div>• 零交易手续费</div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white border border-gray-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-gray-900">Premium</h3>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    -{pricing.premium.discount} off
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${pricing.premium.price}<span className="text-sm text-gray-900">/月</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-600">${pricing.premium.yearlyPrice}/年</div>
                  )}
                </div>
              </div>
              
              {isAnnual && (
                <div className="bg-purple-50 rounded-full px-4 py-2 text-sm mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  你一年可以省T${pricing.premium.savings}
                </div>
              )}

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 mb-6"
                onClick={() => handleSubscribe('premium')}
                disabled={currentPlan === 'premium'} // 如果是当前方案则禁用
              >
                {currentPlan === 'premium' ? '当前方案' : '立即订阅'}
              </Button>

              <div className="space-y-3 text-gray-600">
                <div>• 20 网站机器人</div>
                <div>• 3 AI 交易机器人</div>
                <div>• AI 交易机器人每个机器人的最大总投资额为12,000 美元</div>
                <div>• 最高订单优先排序</div>
                <div>• 零交易手续费</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg shadow-sm"></div>
            <span className="text-xl font-bold text-black">比较方案</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 text-gray-500 font-normal">方案价格</th>
                  <th className="text-left py-4 text-gray-500 font-normal">Basic</th>
                  <th className="text-left py-4 text-gray-500 font-normal">Pro</th>
                  <th className="text-left py-4 text-gray-500 font-normal">Pro+</th>
                  <th className="text-left py-4 text-gray-500 font-normal">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">月费</td>
                  <td className="text-gray-900">$0.00/月</td>
                  <td className="text-gray-900">$14.99/月</td>
                  <td className="text-gray-900">$29.99/月</td>
                  <td className="text-gray-900">$59.99/月</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">年费</td>
                  <td className="text-gray-900">$0.00/月</td>
                  <td className="text-gray-900">$9.99/月</td>
                  <td className="text-gray-900">$19.99/月</td>
                  <td className="text-gray-900">$39.99/月</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">网站交易机器人</td>
                  <td className="text-gray-900">1</td>
                  <td className="text-gray-900">5</td>
                  <td className="text-gray-900">10</td>
                  <td className="text-gray-900">20</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">AI 交易机器人</td>
                  <td className="text-gray-900">1</td>
                  <td className="text-gray-900">2</td>
                  <td className="text-gray-900">2</td>
                  <td className="text-gray-900">3</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">AI 交易机器人每个机器人的最大总投资</td>
                  <td className="text-gray-900">1,000 美元</td>
                  <td className="text-gray-900">3,000 美元</td>
                  <td className="text-gray-900">6,000 美元</td>
                  <td className="text-gray-900">12,000 美元</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">订单优先排序</td>
                  <td className="text-gray-900">最低</td>
                  <td className="text-gray-900">低</td>
                  <td className="text-gray-900">高</td>
                  <td className="text-gray-900">最高的</td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-500">交易手续费</td>
                  <td className="text-gray-900">0%</td>
                  <td className="text-gray-900">0%</td>
                  <td className="text-gray-900">0%</td>
                  <td className="text-gray-900">0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

