import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''
    const currency = searchParams.get('currency') || 'All Currencies'
    const userAddress = searchParams.get('userAddress') || ''
    const offset = (page - 1) * limit

    console.log('Transactions API called with params:', {
      page,
      limit,
      search,
      currency,
      userAddress,
      offset
    })

    if (!userAddress) {
      console.log('No userAddress provided')
      return NextResponse.json({
        transactions: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
        }
      }, { status: 200 })
    }

    // 构建基础查询条件
    let whereConditions = ['(sender = ? OR recipient = ?)']
    let queryParams: any[] = [userAddress, userAddress]

    if (search) {
      whereConditions.push('(sender LIKE ? OR recipient LIKE ? OR tx_hash LIKE ?)')
      const searchParam = `%${search}%`
      queryParams.push(searchParam, searchParam, searchParam)
    }

    if (currency !== '所有币种' && currency !== 'All Currencies') {
      whereConditions.push('asset = ?')
      queryParams.push(currency)
    }

    const whereClause = whereConditions.join(' AND ')
    
    // 计数查询
    const countQueryString = `SELECT COUNT(*) as total FROM transfers WHERE ${whereClause}`
    console.log('Executing count query:', countQueryString)
    console.log('Count query params:', queryParams)
    
    const countResult = await query({
      query: countQueryString,
      values: queryParams
    })

    // 主查询 - 使用字符串拼接来避免参数问题
    const queryString = `SELECT id, amount, asset, sender, recipient, tx_hash, timestamp FROM transfers WHERE ${whereClause} ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`
    
    console.log('Executing main query:', queryString)
    console.log('Using direct query without parameters for LIMIT/OFFSET')
    
    const rows = await query({
      query: queryString,
      values: queryParams
    })

    const total = (countResult as any)[0].total
    const totalPages = Math.ceil(total / limit)

    console.log('Query results:', {
      total,
      totalPages,
      rowsCount: (rows as any[]).length
    })

    return NextResponse.json({
      transactions: rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: total,
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

