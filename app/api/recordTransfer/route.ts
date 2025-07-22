import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, asset, sender, recipient, txHash, timestamp } = body

    // Convert the ISO timestamp to MySQL datetime format
    const date = new Date(timestamp)
    const mysqlTimestamp = date.toISOString().slice(0, 19).replace('T', ' ')

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })

    await connection.execute(
      'INSERT INTO transfers (amount, asset, sender, recipient, tx_hash, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      [amount, asset, sender, recipient, txHash, mysqlTimestamp]
    )

    await connection.end()

    return NextResponse.json({ message: 'Transfer recorded successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error recording transfer:', error)
    return NextResponse.json({ error: 'Failed to record transfer' }, { status: 500 })
  }
}

