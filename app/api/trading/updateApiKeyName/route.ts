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
    const { walletAddress, oldKeyName, newKeyName } = await req.json();

    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE trading_api_keys SET key_name = ? WHERE wallet_address = ? AND key_name = ?',
      [newKeyName, walletAddress, oldKeyName]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新API密钥名称错误:', error);
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
} 