export type BlockType = "paragraph" | "heading" | "todo" | "quote" | "list"

export interface Block {
  id: string
  type: BlockType
  content: string
  level?: number // for headings
  completed?: boolean // for todos
}

export interface Page {
  id: string
  title: string
  blocks: Block[]
}
