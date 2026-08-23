import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useChat } from "@ai-sdk/react";
import { Bot, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat() as any;

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "fixed inset-x-2 bottom-16 z-50 p-0 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[420px]",
        open ? "block" : "hidden",
      )}
      role="dialog"
      aria-label="AI chat"
    >
      <div className="flex h-[70dvh] flex-col overflow-hidden rounded-lg border bg-card shadow-card-hover sm:h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" strokeWidth={1.75} />
            <h2 className="text-sm font-medium">Ask your notes</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              title="Clear chat"
              aria-label="Clear chat"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={() => setMessages([])}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              title="Close chat"
              aria-label="Close chat"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          ref={scrollRef}
          aria-live="polite"
        >
          {messages.map((message: any) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"
                aria-hidden
              >
                <Bot className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <p className="max-w-[30ch]">
                Ask a question and the AI will answer using your notes.
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your notes..."
            ref={inputRef}
            aria-label="Chat message"
            className="flex-1"
          />
          <Button type="submit" disabled={!input?.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: any;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-end gap-2",
        isAiMessage ? "justify-start" : "justify-end",
      )}
    >
      {isAiMessage && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
          aria-hidden
        >
          <Bot className="h-4 w-4" strokeWidth={1.75} />
        </div>
      )}
      <p
        className={cn(
          "max-w-[75%] whitespace-pre-line rounded-lg px-3 py-2 text-sm leading-relaxed",
          isAiMessage
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      )}
    </div>
  );
}
