import { NextResponse } from 'next/server'
import { getContacts, addContact, deleteContact, updateContact } from '@/app/actions/contacts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const contacts = await getContacts(userId)
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId, name, address } = await request.json()

  if (!userId || !name || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const result = await addContact(userId, name, address)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const contactId = searchParams.get('contactId')

  if (!userId || !contactId) {
    return NextResponse.json({ error: 'User ID and Contact ID are required' }, { status: 400 })
  }

  try {
    const result = await deleteContact(userId, parseInt(contactId))
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { userId, contactId, name, address } = await request.json()

  if (!userId || !contactId || !name || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const result = await updateContact(userId, contactId, name, address)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

