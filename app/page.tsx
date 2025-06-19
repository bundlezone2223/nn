"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Editor } from "@/components/editor"
import type { Page } from "@/types"

export default function NotionClone() {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "1",
      title: "Getting Started",
      blocks: [
        {
          id: "1",
          type: "heading",
          content: "Welcome to your workspace",
          level: 1,
        },
        {
          id: "2",
          type: "paragraph",
          content: "This is your personal workspace where you can write, plan, and organize.",
        },
        {
          id: "3",
          type: "heading",
          content: "What you can do here",
          level: 2,
        },
        {
          id: "4",
          type: "todo",
          content: "Create pages and organize your thoughts",
          completed: false,
        },
        {
          id: "5",
          type: "todo",
          content: "Add different types of content blocks",
          completed: false,
        },
        {
          id: "6",
          type: "todo",
          content: "Build your knowledge base",
          completed: false,
        },
      ],
    },
  ])

  const [currentPageId, setCurrentPageId] = useState("1")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentPage = pages.find((page) => page.id === currentPageId)

  const createPage = (title: string) => {
    const newPage: Page = {
      id: Date.now().toString(),
      title,
      blocks: [
        {
          id: Date.now().toString(),
          type: "heading",
          content: title,
          level: 1,
        },
      ],
    }
    setPages([...pages, newPage])
    setCurrentPageId(newPage.id)
  }

  const updatePage = (pageId: string, updatedPage: Partial<Page>) => {
    setPages(pages.map((page) => (page.id === pageId ? { ...page, ...updatedPage } : page)))
  }

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return

    const newPages = pages.filter((page) => page.id !== pageId)
    setPages(newPages)

    if (currentPageId === pageId) {
      setCurrentPageId(newPages[0].id)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        onPageSelect={setCurrentPageId}
        onPageCreate={createPage}
        onPageDelete={deletePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {currentPage && (
          <Editor
            page={currentPage}
            onPageUpdate={(updatedPage) => updatePage(currentPage.id, updatedPage)}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
      </main>
    </div>
  )
}
