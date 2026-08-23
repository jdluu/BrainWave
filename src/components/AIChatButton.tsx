import { Bot } from "lucide-react";
import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setChatBoxOpen(true)}
        aria-label="Open AI chat"
        className="sm:px-4"
      >
        <Bot className="h-5 w-5 sm:mr-2" strokeWidth={1.75} />
        <span className="hidden sm:inline">AI Chat</span>
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
