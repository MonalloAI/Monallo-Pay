import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 格式化日期为 MySQL 支持的格式 (YYYY-MM-DD HH:mm:ss)
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export async function POST(req: Request) {
  try {
    const { walletAddress, plan, subscriptionType } = await req.json()

    // 检查用户是否存在
    const checkUser = await query({
      query: 'SELECT * FROM user_subscriptions WHERE wallet_address = ?',
      values: [walletAddress],
    })

    const startDate = new Date()
    const endDate = new Date(startDate)
    
    if (subscriptionType === 'yearly') {
      endDate.setFullYear(startDate.getFullYear() + 1)
    } else {
      endDate.setMonth(startDate.getMonth() + 1)
    }

    if (Array.isArray(checkUser) && checkUser.length === 0) {
      // 如果用户不存在，创建新记录
      await query({
        query: `
          INSERT INTO user_subscriptions 
          (wallet_address, subscription_plan, subscription_type, start_date, end_date) 
          VALUES (?, ?, ?, ?, ?)
        `,
        values: [
          walletAddress,
          plan,
          subscriptionType,
          formatDate(startDate),
          formatDate(endDate)
        ],
      })
    } else {
      // 更新现有用户
      await query({
        query: `
          UPDATE user_subscriptions 
          SET subscription_plan = ?, 
              subscription_type = ?,
              start_date = ?,
              end_date = ?
          WHERE wallet_address = ?
        `,
        values: [
          plan,
          subscriptionType,
          formatDate(startDate),
          formatDate(endDate),
          walletAddress
        ],
      })
    }

    // 获取更新后的用户信息
    const result = await query({
      query: 'SELECT * FROM user_subscriptions WHERE wallet_address = ?',
      values: [walletAddress],
    })

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error('Subscription Update Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database update failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
} 