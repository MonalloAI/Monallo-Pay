import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface Contact {
  id: number
  name: string
  address: string
}

interface ContactSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (address: string) => void
  contacts: Contact[]
}

export function ContactSelector({ isOpen, onClose, onSelect, contacts }: ContactSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">选择联系人</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Input
            placeholder="搜索联系人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="mt-4 space-y-2 h-[500px] overflow-y-auto">
          {filteredContacts.map(contact => (
            <Button
              key={contact.id}
              variant="outline"
              className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => {
                onSelect(contact.address)
                onClose()
              }}
            >
              <div className="flex flex-col items-start">
                <span>{contact.name}</span>
                <span className="text-xs text-gray-500">{contact.address}</span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

