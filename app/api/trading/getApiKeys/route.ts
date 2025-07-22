import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function POST(req: Request) {
  let connection;
  try {
    const { walletAddress } = await req.json();

    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      `SELECT 
        key_name as name, 
        api_key as \`key\`, 
        exchange 
       FROM trading_api_keys 
       WHERE wallet_address = ?`,
      [walletAddress]
    );

    // 处理 API key 显示格式
    const apis = (rows as any[]).map(row => ({
      ...row,
      key: row.key.slice(0, 6) + '*'.repeat(30) + row.key.slice(-5),
      exchange: row.exchange
    }));

    return NextResponse.json({ success: true, data: apis });
  } catch (error) {
    console.error('获取API密钥错误:', error);
    return NextResponse.json(
      { success: false, message: '获取失败' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
} 