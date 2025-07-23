'use client'

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/components/LanguageContext"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const { t } = useLanguage();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-l from-purple-50 to-[#FFFEFF]">
        <div className="relative p-12 overflow-hidden">
          {/* 毛玻璃遮罩层 */}
          <div className="absolute inset-0 backdrop-blur-md bg-white/30" />
          
          {/* 添加 DialogTitle 以解决可访问性警告 */}
          <DialogTitle className="sr-only">{t('common.comingSoon')}</DialogTitle>
          
          {/* 内容 */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800/80 animate-fade-in mb-4">
              {t('common.comingSoon')}
            </div>
            <p className="text-gray-600 text-center">
              {t('common.featureInDevelopment')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}