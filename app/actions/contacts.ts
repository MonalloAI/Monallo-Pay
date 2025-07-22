'use server'

import { query } from '@/lib/db';

export async function getContacts(userId: string) {
  const data = await query({
    query: 'SELECT * FROM contacts WHERE user_id = ?',
    values: [userId],
  });
  
  // Ensure we're returning plain objects
  return JSON.parse(JSON.stringify(data));
}

export async function addContact(userId: string, name: string, address: string) {
  const result = await query({
    query: 'INSERT INTO contacts (user_id, name, address) VALUES (?, ?, ?)',
    values: [userId, name, address],
  });

  // Use type assertion to access insertId
  const insertId = (result as { insertId: number }).insertId;
  
  // Return a plain object with the new contact's data
  return {
    id: insertId,
    name,
    address
  };
}

export async function deleteContact(userId: string, contactId: number) {
  await query({
    query: 'DELETE FROM contacts WHERE id = ? AND user_id = ?',
    values: [contactId, userId],
  });
  
  // Return a plain object indicating success
  return { success: true };
}

export async function updateContact(userId: string, contactId: number, name: string, address: string) {
  await query({
    query: 'UPDATE contacts SET name = ?, address = ? WHERE id = ? AND user_id = ?',
    values: [name, address, contactId, userId],
  });
  
  // Return a plain object with the updated contact's data
  return { id: contactId, name, address };
}