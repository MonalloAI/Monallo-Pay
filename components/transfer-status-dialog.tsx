'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface TransferStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  status: 'loading' | 'success' | 'error'
  errorMessage?: string
}

export function TransferStatusDialog({ isOpen, onClose, status, errorMessage }: TransferStatusDialogProps) {
  const [showDialog, setShowDialog] = useState(isOpen)

  useEffect(() => {
    setShowDialog(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setShowDialog(false)
    setTimeout(onClose, 300) // Delay to allow exit animation
  }

  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-4"
            >
              <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />
              <p className="mt-4 text-lg font-semibold">转账处理中...</p>
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center p-4"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="mt-4 text-lg font-semibold">转账成功！</p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center p-4"
            >
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="mt-4 text-lg font-semibold">转账失败</p>
              {errorMessage && <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

