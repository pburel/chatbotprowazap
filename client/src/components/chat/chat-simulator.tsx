import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile, MoreVertical } from "lucide-react";
import ChatMessage from "./chat-message";

const initialMessages = [
  {
    id: 1,
    text: "Hi, I need help with my order",
    isUser: true,
    time: "2:34 PM",
  },
  {
    id: 2,
    text: "Hello! I'd be happy to help you with your order. Can you please provide your order number?",
    isUser: false,
    time: "2:34 PM",
  },
  {
    id: 3,
    text: "My order number is #12345",
    isUser: true,
    time: "2:35 PM",
  },
  {
    id: 4,
    text: "I found your order! It was shipped yesterday and should arrive by tomorrow. Would you like to:",
    isUser: false,
    time: "2:36 PM",
    options: [
      "📦 Track your package",
      "📞 Contact support",
      "↩️ Make a return",
    ],
  },
];

export default function ChatSimulator() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm processing your request...",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full lg:w-96 bg-white dark:bg-card border-l border-border flex flex-col h-screen lg:h-auto lg:min-h-[600px]">
      {/* Chat Header */}
      <CardHeader className="p-4 border-b border-border bg-whatsapp-secondary">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1600267185393-e158a98703de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" />
            <AvatarFallback>CB</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Chat Bot Simulator</h3>
            <p className="text-sm text-whatsapp-light opacity-90">Test your bot responses</p>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:text-whatsapp-light">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Chat Messages */}
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 whatsapp-bg chat-scroll">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </CardContent>

      {/* Chat Input */}
      <div className="p-4 border-t border-border bg-white dark:bg-card">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a test message..."
            className="flex-1 border-border focus:ring-whatsapp-primary focus:border-whatsapp-primary rounded-full"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-whatsapp-primary hover:bg-whatsapp-secondary text-white rounded-full p-2 h-auto"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
