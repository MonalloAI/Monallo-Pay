import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ethers } from 'ethers'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onWithdraw: (amount: string) => Promise<void>
  nodeName: string
  maxAmount: string
}

export function WithdrawModal({ isOpen, onClose, onWithdraw, nodeName, maxAmount }: WithdrawModalProps) {
  const [amount, setAmount] = useState('')

  const handleWithdraw = async () => {
    if (!amount) return
    await onWithdraw(amount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw from {nodeName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            placeholder="Enter withdrawal amount (LAT)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={ethers.utils.formatEther(maxAmount)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Max: {ethers.utils.formatEther(maxAmount)} LAT
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

