"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageCircle, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function FitnessCoachSidebar({
  conversationId,
}: {
  conversationId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [id] = useState(conversationId || uuidv4());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 👇 Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/fitness-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: id,
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      if (data.content) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-label={
          isOpen ? "Close fitness coach chat" : "Open fitness coach chat"
        }
        onClick={toggleChat}
        className="fixed top-4 right-4 z-40 h-14 w-14 rounded-full bg-rose-500 text-white shadow-2xl hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      <div
        className={cn(
          "fixed top-20 right-4 z-40 w-full max-w-sm transition-all duration-200",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Your Fitness Coach</h3>
                <p className="text-xs text-muted-foreground">
                  Ask anything, anytime
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col justify-end space-y-3 p-4">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground opacity-80">
                    <MessageCircle className="mx-auto mb-2 h-5 w-5 opacity-70" />
                    Ask about workouts, nutrition, or recovery tips
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        m.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] whitespace-pre-wrap wrap-break-words rounded-2xl px-3 py-2 text-xs",
                          m.role === "user"
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : "border border-rose-200 bg-rose-500/5 text-rose-900 shadow-sm dark:border-rose-500/30 dark:text-rose-50"
                        )}
                      >
                        {m.role === "assistant" ? (
                          <ReactMarkdown
                            className="space-y-2 leading-relaxed"
                            components={{
                              p: ({ node, ...props }) => <p {...props} />,
                              strong: ({ node, ...props }) => (
                                <strong className="font-semibold" {...props} />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-4" {...props} />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="mb-1" {...props} />
                              ),
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        ) : (
                          m.content
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-full bg-rose-500/10 p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Ask anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="h-10 text-sm"
                autoComplete="on"
              />
              <Button
                size="sm"
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-10 px-3 bg-rose-500 text-white hover:bg-rose-600 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
