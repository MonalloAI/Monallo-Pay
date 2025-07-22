import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  return (
    <div className={`flex items-center justify-center space-x-2 mt-4 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-gray-700 text-white hover:bg-gray-800 bg-gray-900"
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </Button>
      <span className="text-sm text-gray-300">
        第 {currentPage} 页，共 {totalPages} 页
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-gray-700 text-white hover:bg-gray-800 bg-gray-900"
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

