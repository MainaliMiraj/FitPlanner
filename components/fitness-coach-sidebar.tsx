"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, AlertCircle, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

interface FitnessCoachSidebarProps {
  conversationId?: string
}

export function FitnessCoachSidebar({ conversationId }: FitnessCoachSidebarProps) {
  const [id, setId] = useState<string>("")
  const [isClient, setIsClient] = useState(false)
  const [width, setWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    if (conversationId) {
      setId(conversationId)
    } else {
      setId(uuidv4())
    }
  }, [conversationId])

  const { messages, append, isLoading, input, handleInputChange } = useChat({
    api: "/api/ai/fitness-coach",
    body: {
      conversationId: id,
    },
    onError: (error: Error) => {
      console.error("[v0] Chat error:", error)
      setError(error?.message || "Failed to send message")
    },
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      if (newWidth > 280 && newWidth < 600) {
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) {
      return
    }

    setError(null)
    try {
      await append({ role: "user", content: inputValue })
      setInputValue("")
    } catch (err) {
      console.error("[v0] Error sending message:", err)
      setError("Failed to send message")
    }
  }

  if (!isClient || !id) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="hidden xl:flex flex-col border-l bg-background h-screen overflow-hidden"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
        <MessageCircle className="h-5 w-5 text-rose-500" />
        <h3 className="font-semibold text-sm">AI Coach</h3>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-rose-500/30 transition-colors"
      />

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {error && (
            <div className="flex gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-6 w-6 mx-auto text-muted-foreground mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">Ask about workouts, nutrition, or fitness tips</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-rose-500/20">
                      <MessageCircle className="h-3 w-3 text-rose-500" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs max-w-xs break-words",
                      message.role === "user" ? "bg-rose-500 text-white" : "bg-muted",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-rose-500/20">
                    <Loader2 className="h-3 w-3 text-rose-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-3 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Ask..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="text-xs h-8"
            autoComplete="off"
          />
          <Button
            size="sm"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-rose-500 hover:bg-rose-600 h-8 px-2"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  )
}
