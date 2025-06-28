'use client'

import { ResearcherDetails } from "@/db/types"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

interface Props {
    researchers: ResearcherDetails[]
    onFilterChange: (filteredData: ResearcherDetails[]) => void
}

export default function ResearcherFilter({ researchers, onFilterChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!searchTerm.trim()) {
      onFilterChange(researchers)
      return
    }

    const filtered = researchers.filter(researcher =>
      researcher.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
    onFilterChange(filtered)
  }, [searchTerm, researchers, onFilterChange])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K to focus search (avoiding browser conflict)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault()
        e.stopPropagation()
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      }
      
      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        e.preventDefault()
        clearSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [searchTerm, clearSearch])

  const resultCount = searchTerm.trim() 
    ? researchers.filter(researcher =>
        researcher.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      ).length
    : researchers.length

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="البحث عن باحث... (Ctrl+Shift+K)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-10"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            title="مسح البحث (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {searchTerm.trim() ? (
          <span>
            تم العثور على <span className="font-medium text-foreground">{resultCount}</span> باحث
            {resultCount !== 1 && 'ين'}
          </span>
        ) : (
          <span>
            إجمالي الباحثين: <span className="font-medium text-foreground">{resultCount}</span>
          </span>
        )}
      </div>
    </div>
  )
}
