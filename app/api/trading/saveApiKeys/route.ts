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
    const body = await req.json();
    const { 
      exchange, 
      apiKey, 
      secretKey, 
      keyName,
      walletAddress 
    } = body;

    // 验证所有必需的字段
    if (!exchange || !apiKey || !secretKey || !keyName || !walletAddress) {
      return NextResponse.json(
        { success: false, message: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 创建数据库连接
    connection = await mysql.createConnection(dbConfig);

    // 检查是否已存在相同的钱包地址和交易所组合
    const [existing] = await connection.execute(
      'SELECT id FROM trading_api_keys WHERE wallet_address = ? AND exchange = ?',
      [walletAddress, exchange]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // 如果存在，则更新
      await connection.execute(
        `UPDATE trading_api_keys 
         SET api_key = ?, secret_key = ?, key_name = ?, updated_at = NOW()
         WHERE wallet_address = ? AND exchange = ?`,
        [apiKey, secretKey, keyName, walletAddress, exchange]
      );
    } else {
      // 如果不存在，则插入
      await connection.execute(
        `INSERT INTO trading_api_keys 
         (wallet_address, exchange, api_key, secret_key, key_name, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [walletAddress, exchange, apiKey, secretKey, keyName]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'API密钥保存成功' 
    });

  } catch (error: any) {
    console.error('保存API密钥错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '保存失败，请重试',
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 