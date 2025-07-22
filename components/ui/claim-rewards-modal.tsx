import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ethers } from 'ethers'

interface ClaimRewardsModalProps {
  isOpen: boolean
  onClose: () => void
  onClaimRewards: () => Promise<void>
  nodeName: string
  rewardsAmount: string
}

export function ClaimRewardsModal({ isOpen, onClose, onClaimRewards, nodeName, rewardsAmount }: ClaimRewardsModalProps) {
  const handleClaimRewards = async () => {
    await onClaimRewards()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim Rewards from {nodeName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Available rewards: {ethers.utils.formatEther(rewardsAmount)} LAT</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleClaimRewards}>Claim Rewards</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

