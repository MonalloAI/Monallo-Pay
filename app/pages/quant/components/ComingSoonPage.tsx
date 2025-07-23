'use client'

import { useLanguage } from "@/components/LanguageContext"

export function ComingSoonPage() {
  const { t } = useLanguage();
  return (
    <div className="relative w-full h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 毛玻璃遮罩层 */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/50 flex items-center justify-center">
        <div className="text-6xl font-bold text-gray-800/80 animate-fade-in">
          {t('common.comingSoon')}
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white/30" />
    </div>
  )
}