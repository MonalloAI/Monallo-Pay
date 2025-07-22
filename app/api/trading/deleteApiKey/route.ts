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
    const { walletAddress, keyName } = await req.json();

    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'DELETE FROM trading_api_keys WHERE wallet_address = ? AND key_name = ?',
      [walletAddress, keyName]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除API密钥错误:', error);
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
} 