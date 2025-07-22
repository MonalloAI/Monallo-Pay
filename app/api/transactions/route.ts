import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''
    const currency = searchParams.get('currency') || '所有币种'
    const userAddress = searchParams.get('userAddress') || ''
    const offset = (page - 1) * limit

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })

    let query = 'SELECT id, amount, asset, sender, recipient, tx_hash, timestamp FROM transfers WHERE (sender = ? OR recipient = ?)'
    let countQuery = 'SELECT COUNT(*) as total FROM transfers WHERE (sender = ? OR recipient = ?)'
    const queryParams: any[] = [userAddress, userAddress]

    if (search) {
      query += ' AND (sender LIKE ? OR recipient LIKE ? OR tx_hash LIKE ?)'
      countQuery += ' AND (sender LIKE ? OR recipient LIKE ? OR tx_hash LIKE ?)'
      const searchParam = `%${search}%`
      queryParams.push(searchParam, searchParam, searchParam)
    }

    if (currency !== '所有币种') {
      query += ' AND asset = ?'
      countQuery += ' AND asset = ?'
      queryParams.push(currency)
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?'
    queryParams.push(limit, offset)

    const [rows] = await connection.query(query, queryParams)
    const [countResult] = await connection.query(countQuery, queryParams.slice(0, -2))

    await connection.end()

    const total = (countResult as any)[0].total
    const totalPages = Math.ceil(total / limit)

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
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

