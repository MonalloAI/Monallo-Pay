'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CryptoPayment } from './CryptoPayment'
import toast from 'react-hot-toast'

interface PlanPricing {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  yearSavings: number
}

interface SubscriptionConfirmProps {
  onBack: () => void
  selectedPlan: 'pro' | 'proPlus' | 'premium'
  onSubscriptionSuccess: () => void
}

const PLAN_PRICING: Record<string, PlanPricing> = {
  pro: {
    name: 'Pro',
    monthlyPrice: 0.01,
    yearlyPrice: 9.99,
    yearSavings: 60
  },
  proPlus: {
    name: 'Pro+',
    monthlyPrice: 29.99,
    yearlyPrice: 19.99,
    yearSavings: 120
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 59.99,
    yearlyPrice: 39.99,
    yearSavings: 240
  }
}

export function SubscriptionConfirm({ onBack, selectedPlan, onSubscriptionSuccess }: SubscriptionConfirmProps) {
  const [paymentType, setPaymentType] = useState<'yearly' | 'monthly'>('yearly')
  const [showPayment, setShowPayment] = useState(false)
  const planDetails = PLAN_PRICING[selectedPlan]

  // 计算支付金额
  const getPaymentAmount = () => {
    if (paymentType === 'yearly') {
      return planDetails.yearlyPrice * 12
    }
    return planDetails.monthlyPrice
  }

  const handlePaymentSuccess = async () => {
    let retries = 3
    
    while (retries > 0) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        const walletAddress = accounts[0]

        // 更新数据库中的订阅状态
        const response = await fetch('/api/user/subscription/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            walletAddress,
            plan: selectedPlan,
            subscriptionType: paymentType
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          toast.success('订阅更新成功！')
          onSubscriptionSuccess() // 通知父组件更新成功
          return // 成功后直接返回
        }
        
        // 如果不成功但还有重试次数，继续重试
        throw new Error(data.error || '订阅更新失败')
        
      } catch (error) {
        console.error('更新订阅状态错误:', error)
        retries--
        
        if (retries === 0) {
          // 所有重试都失败了
          toast.error('订阅更新失败，请联系客服')
          // 可以添加一个错误报告功能
          console.error('Final subscription update error:', error)
          return
        }
        
        // 等待1秒后重试
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.loading('正在重试更新订阅状态...')
      }
    }
  }

  if (showPayment) {
    return (
      <CryptoPayment 
        planName={`${planDetails.name} 方案 (${paymentType === 'yearly' ? '1年' : '每月'})`}
        amount={getPaymentAmount()}
        onBack={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-l from-purple-50 to-[#FFFEFF] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">年付或月付</h2>
            
            <RadioGroup 
              value={paymentType} 
              onValueChange={(value) => setPaymentType(value as 'yearly' | 'monthly')}
              className="space-y-6"
            >
              {/* 年付选项 */}
              <div>
                <RadioGroupItem
                  value="yearly"
                  id="yearly"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="yearly"
                  className="flex items-center justify-between p-6 rounded-lg border-2 cursor-pointer
                    peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50
                    hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-lg">{planDetails.name} 方案 (1年)</div>
                    <div className="text-sm text-gray-500">
                      相比于每月付款方案，可以节省 ${planDetails.yearSavings} (折扣率约达 ~33%)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">${planDetails.yearlyPrice} /月</div>
                    <div className="text-sm text-gray-500">(${planDetails.yearlyPrice * 12} /年)</div>
                  </div>
                </Label>
              </div>

              {/* 月付选项 */}
              <div>
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="monthly"
                  className="flex items-center justify-between p-6 rounded-lg border-2 cursor-pointer
                    peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50
                    hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-lg">{planDetails.name} 方案 (每月)</div>
                    <div className="text-sm text-gray-500">最灵活的选择，每月结算费用</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">${planDetails.monthlyPrice} /月</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-10 space-y-4 text-lg">
              <div className="flex justify-between text-gray-600">
                <span>首付款金额</span>
                <span>${getPaymentAmount()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>下一个账单周期开始于 {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}</span>
                <span>${getPaymentAmount()}</span>
              </div>
            </div>

            <div className="mt-10 flex gap-6">
              <Button 
                onClick={onBack}
                variant="outline" 
                className="flex-1 h-12 text-lg"
              >
                取消
              </Button>
              <Button 
                onClick={() => setShowPayment(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
              >
                下一步
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 