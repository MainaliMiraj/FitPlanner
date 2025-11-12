"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageCircle } from "lucide-react";
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
  const [id, setId] = useState(conversationId || uuidv4());
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

  return (
    <div className="hidden xl:flex flex-col border-l bg-background h-screen overflow-hidden w-[360px]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b shrink-0">
        <MessageCircle className="h-5 w-5 text-rose-500" />
        <h3 className="font-semibold text-sm">Your Personal Fitness Coach</h3>
      </div>

      {/* 👇 Scrollable chat area */}
      <div className="flex-1 h-0">
        <ScrollArea className="h-full overflow-y-auto">
          <div className="flex flex-col justify-end h-full space-y-3 p-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground opacity-70">
                <MessageCircle className="h-5 w-5 mx-auto mb-2 opacity-50" />
                Ask about workouts, nutrition, or recovery tips
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 text-xs max-w-[80%] break-words whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-rose-500 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="mb-2" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-4 mb-2" {...props} />
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
                <div className="rounded bg-rose-500/10 p-2">
                  <Loader2 className="h-3 w-3 text-rose-500 animate-spin" />
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="border-t p-3 shrink-0">
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
  );
}
