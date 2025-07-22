import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json()

    // 添加重试逻辑
    let retries = 3
    let result
    
    while (retries > 0) {
      try {
        // 检查用户是否存在
        const checkUser = await query({
          query: 'SELECT * FROM user_subscriptions WHERE wallet_address = ?',
          values: [walletAddress],
        })

        if (Array.isArray(checkUser) && checkUser.length === 0) {
          // 如果用户不存在，创建新用户记录
          await query({
            query: 'INSERT INTO user_subscriptions (wallet_address, subscription_plan) VALUES (?, ?)',
            values: [walletAddress, 'basic'],
          })
        }

        // 获取用户订阅信息
        result = await query({
          query: 'SELECT * FROM user_subscriptions WHERE wallet_address = ?',
          values: [walletAddress],
        })
        
        break // 如果成功，跳出循环
      } catch (error) {
        retries--
        if (retries === 0) throw error
        await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒后重试
      }
    }

    return NextResponse.json({ success: true, data: Array.isArray(result) ? result[0] : null })
  } catch (error) {
    console.error('Subscription API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
} 