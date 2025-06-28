'use client'

import { ResearcherDetails } from "@/db/types"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Props {
    researchers: ResearcherDetails[]
    onFilterChange: (filteredData: ResearcherDetails[]) => void
}

export default function ResearcherFilter({ researchers, onFilterChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsSearching(true)
    
    // Add a small delay for better UX when typing
    const timeoutId = setTimeout(() => {
      if (!searchTerm.trim()) {
        onFilterChange(researchers)
        setIsSearching(false)
        return
      }

      const filtered = researchers.filter(researcher =>
        researcher.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
      onFilterChange(filtered)
      setIsSearching(false)
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, researchers, onFilterChange])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      
      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        clearSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchTerm])

  const clearSearch = () => {
    setSearchTerm("")
  }

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
          placeholder="البحث عن باحث... (Ctrl+K)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-10"
          disabled={isSearching}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSearching}
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
