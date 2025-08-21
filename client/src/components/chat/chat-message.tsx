import { Button } from "@/components/ui/button";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: number;
    text: string;
    isUser: boolean;
    time: string;
    options?: string[];
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs rounded-lg p-3 shadow-sm ${
          message.isUser
            ? 'chat-bubble-user text-whatsapp-dark'
            : 'chat-bubble-bot'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        
        {message.options && (
          <div className="space-y-2 mt-3">
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left p-2 h-auto text-sm hover:bg-accent transition-colors justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        
        <div className={`flex items-center mt-1 space-x-1 ${
          message.isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-muted-foreground">{message.time}</span>
          {message.isUser && (
            <CheckCheck className="h-3 w-3 text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
}
