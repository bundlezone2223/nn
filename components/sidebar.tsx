"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, FileText, Trash2, Search } from "lucide-react"
import type { Page } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SidebarProps {
  pages: Page[]
  currentPageId: string
  onPageSelect: (pageId: string) => void
  onPageCreate: (title: string) => void
  onPageDelete: (pageId: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ pages, currentPageId, onPageSelect, onPageCreate, onPageDelete, isOpen }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState("")

  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      onPageCreate(newPageTitle.trim())
      setNewPageTitle("")
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-muted/30 border-r border-border z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="font-semibold">Workspace</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>

        {/* Pages List */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {isCreating && (
              <div className="flex items-center gap-2 px-2 py-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreatePage()
                    if (e.key === "Escape") {
                      setIsCreating(false)
                      setNewPageTitle("")
                    }
                  }}
                  onBlur={handleCreatePage}
                  placeholder="Page title..."
                  className="h-6 text-sm"
                  autoFocus
                />
              </div>
            )}

            {filteredPages.map((page) => (
              <div key={page.id} className="group">
                <DropdownMenu>
                  <div className="flex items-center">
                    <Button
                      variant={currentPageId === page.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start h-8 px-2 text-sm font-normal"
                      onClick={() => onPageSelect(page.id)}
                    >
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{page.title}</span>
                    </Button>

                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                        <span className="sr-only">Page options</span>
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                      </Button>
                    </DropdownMenuTrigger>
                  </div>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onPageDelete(page.id)}
                      className="text-destructive"
                      disabled={pages.length <= 1}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          <Button variant="ghost" className="w-full justify-start h-8 text-sm" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>
      </div>
    </div>
  )
}
