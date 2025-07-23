'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/components/LanguageContext"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  address: string
  title?: string
}

export function QRCodeModal({ isOpen, onClose, address, title = "收款码" }: QRCodeModalProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    if (address) {
      QRCode.toDataURL(address)
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(t('qrcode.generationFailed'), err))
    }
  }, [address])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address)
      alert(t('qrcode.addressCopied'))
    } catch (err) {
      console.error(t('common.copyFailed'), err)
    }
  }

  const saveQRCode = () => {
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = qrCodeUrl
    link.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={onClose} />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            {qrCodeUrl && (
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            )}
          </div>
          <p className="text-sm text-center break-all px-4">{address}</p>
          <div className="flex w-full gap-4 px-4">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={copyToClipboard}
            >
              {t('common.copy')}
            </Button>
            <Button 
              className="flex-1"
              onClick={saveQRCode}
            >
              {t('qrcode.saveQR')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

