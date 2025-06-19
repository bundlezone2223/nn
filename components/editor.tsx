"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Menu, Plus, Type, Heading1, CheckSquare, Quote } from "lucide-react"
import type { Page, Block, BlockType } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface EditorProps {
  page: Page
  onPageUpdate: (page: Partial<Page>) => void
  onToggleSidebar: () => void
}

export function Editor({ page, onPageUpdate, onToggleSidebar }: EditorProps) {
  const [title, setTitle] = useState(page.title)
  const [blocks, setBlocks] = useState<Block[]>(page.blocks)
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)

  useEffect(() => {
    setTitle(page.title)
    setBlocks(page.blocks)
  }, [page])

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle)
    onPageUpdate({ title: newTitle })
  }

  const updateBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks)
    onPageUpdate({ blocks: newBlocks })
  }

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    updateBlocks(newBlocks)
  }

  const addBlock = (afterBlockId?: string, type: BlockType = "paragraph") => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      ...(type === "heading" && { level: 1 }),
      ...(type === "todo" && { completed: false }),
    }

    if (afterBlockId) {
      const index = blocks.findIndex((block) => block.id === afterBlockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      updateBlocks(newBlocks)
    } else {
      updateBlocks([...blocks, newBlock])
    }

    setFocusedBlockId(newBlock.id)
  }

  const deleteBlock = (blockId: string) => {
    if (blocks.length <= 1) return
    const newBlocks = blocks.filter((block) => block.id !== blockId)
    updateBlocks(newBlocks)
  }

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addBlock(blockId)
    }

    if (e.key === "Backspace") {
      const block = blocks.find((b) => b.id === blockId)
      if (block && block.content === "") {
        e.preventDefault()
        deleteBlock(blockId)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
          <Menu className="w-4 h-4" />
        </Button>

        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0"
            placeholder="Untitled"
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <BlockComponent
                key={block.id}
                block={block}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onAddBlock={() => addBlock(block.id)}
                onDelete={() => deleteBlock(block.id)}
                isFocused={focusedBlockId === block.id}
                canDelete={blocks.length > 1}
              />
            ))}

            <div className="flex items-center gap-2 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Plus className="w-4 h-4 mr-1" />
                    Add a block
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => addBlock(undefined, "paragraph")}>
                    <Type className="w-4 h-4 mr-2" />
                    Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock(undefined, "heading")}>
                    <Heading1 className="w-4 h-4 mr-2" />
                    Heading
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock(undefined, "todo")}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    To-do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock(undefined, "quote")}>
                    <Quote className="w-4 h-4 mr-2" />
                    Quote
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface BlockComponentProps {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAddBlock: () => void
  onDelete: () => void
  isFocused: boolean
  canDelete: boolean
}

function BlockComponent({
  block,
  onUpdate,
  onKeyDown,
  onAddBlock,
  onDelete,
  isFocused,
  canDelete,
}: BlockComponentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
    }
  }, [isFocused])

  const handleContentChange = (content: string) => {
    onUpdate({ content })
  }

  const renderBlock = () => {
    switch (block.type) {
      case "heading":
        const HeadingTag = `h${block.level || 1}` as keyof JSX.IntrinsicElements
        const headingClass = {
          1: "text-3xl font-bold",
          2: "text-2xl font-semibold",
          3: "text-xl font-medium",
        }[block.level || 1]

        return (
          <Textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Heading"
            className={`${headingClass} border-none shadow-none resize-none p-0 min-h-0 focus-visible:ring-0`}
            rows={1}
          />
        )

      case "todo":
        return (
          <div className="flex items-start gap-3">
            <Checkbox
              checked={block.completed || false}
              onCheckedChange={(checked) => onUpdate({ completed: checked as boolean })}
              className="mt-1"
            />
            <Textarea
              ref={textareaRef}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="To-do"
              className={`flex-1 border-none shadow-none resize-none p-0 min-h-0 focus-visible:ring-0 ${
                block.completed ? "line-through text-muted-foreground" : ""
              }`}
              rows={1}
            />
          </div>
        )

      case "quote":
        return (
          <div className="border-l-4 border-muted-foreground/20 pl-4">
            <Textarea
              ref={textareaRef}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Quote"
              className="italic text-muted-foreground border-none shadow-none resize-none p-0 min-h-0 focus-visible:ring-0"
              rows={1}
            />
          </div>
        )

      default:
        return (
          <Textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type something..."
            className="border-none shadow-none resize-none p-0 min-h-0 focus-visible:ring-0"
            rows={1}
          />
        )
    }
  }

  return (
    <div className="group relative">
      <div className="absolute left-0 top-0 -ml-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onAddBlock}>
              <Plus className="w-4 h-4 mr-2" />
              Add block below
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete block
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-h-[1.5rem]">{renderBlock()}</div>
    </div>
  )
}
