import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, asset, sender, recipient, txHash, timestamp } = body

    // Convert the ISO timestamp to MySQL datetime format
    const date = new Date(timestamp)
    const mysqlTimestamp = date.toISOString().slice(0, 19).replace('T', ' ')

    console.log('Recording transfer:', {
      amount,
      asset,
      sender,
      recipient,
      txHash,
      timestamp: mysqlTimestamp
    })

    await query({
      query: 'INSERT INTO transfers (amount, asset, sender, recipient, tx_hash, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      values: [amount, asset, sender, recipient, txHash, mysqlTimestamp]
    })

    return NextResponse.json({ message: 'Transfer recorded successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error recording transfer:', error)
    return NextResponse.json({ 
      error: 'Failed to record transfer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

