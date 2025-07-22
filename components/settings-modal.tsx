import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from 'lucide-react'
import { updateUserName } from '@/app/actions/user-settings'
import toast from 'react-hot-toast'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  account: string
  displayName: string
  onUpdateName: (newName: string) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  account,
  displayName,
  onUpdateName,
}: SettingsModalProps) {
  const [name, setName] = useState(displayName)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateName = async () => {
    if (!name.trim()) return

    setIsUpdating(true)
    try {
      const result = await updateUserName(account, name)
      if (result.success) {
        onUpdateName(name)
        toast.success('名称更新成功')
        onClose()
      } else {
        toast.error('更新失败，请重试')
      }
    } catch (error) {
      toast.error('更新失败，请重试')
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('地址已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败，请重试')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>账户信息</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>MetaMask地址</Label>
            <div className="flex items-center gap-2">
              <Input
                value={account}
                readOnly
                className="bg-muted"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(account)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Note name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入显示名称"
            />
          </div>
          <Button
            onClick={handleUpdateName}
            disabled={isUpdating || !name.trim() || name === displayName}
          >
            {isUpdating ? '更新中...' : '保存'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

