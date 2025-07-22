'use server'

import mysql from 'mysql2/promise'


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
})

export async function updateUserName(address: string, name: string) {
  try {
    const connection = await pool.getConnection()
    await connection.execute(
      'INSERT INTO user_settings (address, display_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE display_name = ?',
      [address, name, name]
    )
    connection.release()
    return { success: true }
  } catch (error) {
    console.error('Error updating user name:', error)
    return { success: false, error: 'Failed to update user name' }
  }
}

export async function getUserName(address: string) {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute(
      'SELECT display_name FROM user_settings WHERE address = ?',
      [address]
    )
    connection.release()
    return (rows as any[])[0]?.display_name || null
  } catch (error) {
    console.error('Error fetching user name:', error)
    return null
  }
}

