'use client'

import { useState, useEffect } from 'react'
import { Ghost, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { getContacts, addContact, deleteContact, updateContact } from '@/app/actions/contacts'
import { useToast } from "@/hook/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "@/components/LanguageContext"

interface Contact {
  id: number
  name: string
  address: string
}

interface ContactsProps {
  isLoggedIn: boolean
  userId: string
  onContactsChange: (contacts: Contact[]) => void
}

export default function Contacts({ isLoggedIn, userId, onContactsChange }: ContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', address: '' })
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [addressError, setAddressError] = useState('')
  const contactsPerPage = 3
  const { toast } = useToast()

  const truncateAddress = (address: string, start: number = 6, end: number = 4) => {
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchContacts()
    }
  }, [isLoggedIn, userId])

  const fetchContacts = async () => {
    try {
      const fetchedContacts = await getContacts(userId);
      setContacts(fetchedContacts);
      onContactsChange(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }

  const validateAddress = (address: string) => {
    const hexRegex = /^0x[a-fA-F0-9]{40}$/;
    const hashRegex = /^[a-fA-F0-9]{64}$/;
    return hexRegex.test(address) || hashRegex.test(address);
  }

  const { t } = useLanguage();

  const handleAddContact = async () => {
    if (newContact.name && newContact.address) {
      if (!validateAddress(newContact.address)) {
        setAddressError(t('contacts.errors.invalidAddress'));
        return;
      }
      try {
        const addedContact = await addContact(userId, newContact.name, newContact.address);
        const updatedContacts = [...contacts, addedContact];
        setContacts(updatedContacts);
        onContactsChange(updatedContacts);
        setNewContact({ name: '', address: '' });
        setIsAddingContact(false);
        setAddressError('');
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    }
  }

  const handleDeleteConfirm = async () => {
    if (deletingContact) {
      try {
        await deleteContact(userId, deletingContact.id);
        const updatedContacts = contacts.filter(contact => contact.id !== deletingContact.id);
        setContacts(updatedContacts);
        onContactsChange(updatedContacts);
        setDeletingContact(null);
        toast({
          title: t('contacts.deleteSuccess'),
          description: t('contacts.contactDeleted'),
        })
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  }

  const handleUpdateContact = async () => {
    if (editingContact) {
      if (!validateAddress(editingContact.address)) {
        setAddressError(t('contacts.errors.invalidAddress'));
        return;
      }
      try {
        const updatedContact = await updateContact(userId, editingContact.id, editingContact.name, editingContact.address);
        const updatedContacts = contacts.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        );
        setContacts(updatedContacts);
        onContactsChange(updatedContacts);
        setEditingContact(null);
        setAddressError('');
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      toast({
        title: t('common.copySuccess'),
        description: t('contacts.addressCopied'),
      })
    }).catch(err => {
      console.error(t('common.copyFailed'), err);
    });
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-white">{t('contacts.title')}</h1>
        {isLoggedIn && (
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <span className="mr-1">➕</span> {t('contacts.addContact')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] p-0 gap-0 bg-gray-900 border-gray-700">
              <div className="p-6">
                <DialogHeader className="flex flex-row items-center justify-between p-0 mb-6">
                  <DialogTitle className="text-lg font-medium text-white">{t('contacts.addContact')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">{t('contacts.contactName')}</label>
                    <Input
                      placeholder={t('contacts.contactName')}
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">{t('contacts.contactAddress')}</label>
                    <Input
                      placeholder={t('contacts.contactAddress')}
                      value={newContact.address}
                      onChange={(e) => {
                        setNewContact({ ...newContact, address: e.target.value });
                        setAddressError('');
                      }}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                    {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
                  </div>
                  <Button 
                    onClick={handleAddContact} 
                    className="w-full bg-white text-black hover:bg-gray-300"
                  >
                    {t('common.add')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <Ghost className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
          <p className="text-gray-400 mb-4">{t('contacts.noContacts')}</p>
          {!isLoggedIn ? (
            <Link 
              href="/login" 
              className="text-white hover:underline"
            >
              {t('common.loginRegister')}
            </Link>
          ) : (
            <Button variant="secondary" onClick={() => setIsAddingContact(true)} className="bg-gray-800 text-white hover:bg-gray-700">{t('contacts.addNow')}</Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {currentContacts.map((contact) => (
            <div 
              key={contact.id}
              className="p-4 rounded-lg border border-gray-700 bg-gray-800 group hover:bg-gray-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">{contact.name}</h3>
                  <p className="text-sm text-gray-400">{truncateAddress(contact.address)}</p>
                </div>
                <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => handleCopyAddress(contact.address)} className="text-gray-300 hover:text-white hover:bg-gray-700">{t('common.copy')}</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingContact(contact)} className="text-gray-300 hover:text-white hover:bg-gray-700">{t('common.edit')}</Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-gray-700" onClick={() => setDeletingContact(contact)}>{t('common.delete')}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {contacts.length > contactsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(contacts.length / contactsPerPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "bg-white text-black" : "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      {editingContact && (
        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent className="max-w-[400px] p-0 gap-0 bg-gray-900 border-gray-700">
            <div className="p-6">
              <DialogHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <DialogTitle className="text-lg font-medium text-white">{t('contacts.editContact')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">{t('contacts.contactName')}</label>
                  <Input
                    placeholder={t('contacts.contactName')}
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">{t('contacts.contactAddress')}</label>
                  <Input
                    placeholder={t('contacts.contactAddress')}
                    value={editingContact.address}
                    onChange={(e) => {
                      setEditingContact({ ...editingContact, address: e.target.value });
                      setAddressError('');
                    }}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
                </div>
                <Button 
                  onClick={handleUpdateContact} 
                  className="w-full bg-white text-black hover:bg-gray-300"
                >
                  {t('common.update')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingContact} onOpenChange={() => setDeletingContact(null)}>
        <DialogContent className="max-w-[400px] bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('contacts.deleteContact')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">{t('contacts.confirmDelete', { name: deletingContact?.name })}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingContact(null)} className="bg-transparent border-gray-600 text-white hover:bg-gray-800">{t('common.cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="bg-red-700 hover:bg-red-800">{t('common.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

