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
    text: "Hello! 👋 I'd be happy to help you with your order. Can you please provide your order number?",
    isUser: false,
    time: "2:34 PM",
    quickReplies: ["Share Order Number", "Call Support", "Check Account"]
  },
  {
    id: 3,
    text: "My order number is #12345",
    isUser: true,
    time: "2:35 PM",
  },
  {
    id: 4,
    text: "Perfect! 📦 I found your order. Here are the details:",
    isUser: false,
    time: "2:36 PM",
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&w=300&h=200&fit=crop',
      caption: 'Order #12345 - Premium Wireless Headphones'
    }
  },
  {
    id: 5,
    text: "Your package was shipped yesterday and should arrive by tomorrow. How can I help you further?",
    isUser: false,
    time: "2:37 PM",
    buttons: [
      { id: 'track', title: '📦 Track Package', type: 'reply' },
      { id: 'support', title: '📞 Contact Support', type: 'call', phone: '+1234567890' },
      { id: 'return', title: '↩️ Return Item', type: 'reply' }
    ]
  },
  {
    id: 6,
    text: "I'd like to see more products",
    isUser: true,
    time: "2:38 PM",
  },
  {
    id: 7,
    text: "Here are our popular categories:",
    isUser: false,
    time: "2:38 PM",
    list: {
      title: "🛍️ Product Categories",
      description: "Choose a category to explore",
      buttonText: "View All Categories",
      items: [
        { id: 'electronics', title: 'Electronics', description: '📱 Phones, laptops, accessories', icon: '📱' },
        { id: 'clothing', title: 'Fashion & Clothing', description: '👕 Latest trends and styles', icon: '👕' },
        { id: 'home', title: 'Home & Garden', description: '🏠 Furniture, decor, appliances', icon: '🏠' },
        { id: 'sports', title: 'Sports & Fitness', description: '⚽ Equipment and activewear', icon: '⚽' }
      ]
    }
  },
  {
    id: 8,
    text: "Electronics",
    isUser: true,
    time: "2:39 PM",
  },
  {
    id: 9,
    text: "Great choice! Here's a document with our latest electronics catalog:",
    isUser: false,
    time: "2:39 PM",
    media: {
      type: 'document',
      filename: 'Electronics_Catalog_2024.pdf',
      url: '#'
    }
  },
  {
    id: 10,
    text: "Would you like me to share our store location?",
    isUser: false,
    time: "2:40 PM",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      name: 'TechStore NYC',
      address: '123 Broadway, New York, NY 10001'
    }
  }
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

    // Simulate bot response with rich elements
    setTimeout(() => {
      const responses = [
        {
          text: "Thanks for your message! Here are some quick actions:",
          quickReplies: ["📞 Call Us", "📧 Email Support", "🔄 Try Again"]
        },
        {
          text: "I'm processing your request...",
          buttons: [
            { id: 'status', title: '📊 Check Status', type: 'reply' },
            { id: 'help', title: '❓ Get Help', type: 'reply' }
          ]
        },
        {
          text: "Here's what I can help you with:",
          list: {
            title: "🤖 Bot Services",
            description: "Choose an option below",
            buttonText: "View All Services",
            items: [
              { id: 'order', title: 'Order Status', description: 'Check your order details', icon: '📦' },
              { id: 'support', title: 'Customer Support', description: 'Talk to our team', icon: '👥' },
              { id: 'products', title: 'Browse Products', description: 'Explore our catalog', icon: '🛍️' }
            ]
          }
        }
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botResponse = {
        id: messages.length + 2,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...randomResponse
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleButtonClick = (buttonId: string, buttonText: string) => {
    // Add user's button selection as message
    const userMessage = {
      id: messages.length + 1,
      text: `Selected: ${buttonText}`,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response based on button clicked
    setTimeout(() => {
      let responseText = "";
      let extraContent = {};

      switch (buttonId) {
        case 'track':
          responseText = "Here's your tracking information:";
          extraContent = {
            media: {
              type: 'document',
              filename: 'Tracking_Details.pdf',
              url: '#'
            }
          };
          break;
        case 'support':
          responseText = "Connecting you to support...";
          extraContent = {
            quickReplies: ["📞 Call Now", "💬 Chat", "📧 Email"]
          };
          break;
        default:
          responseText = `Great! You selected "${buttonText}". How can I help you further?`;
      }

      const botResponse = {
        id: messages.length + 2,
        text: responseText,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...extraContent
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleQuickReply = (reply: string) => {
    // Add user's quick reply as message
    const userMessage = {
      id: messages.length + 1,
      text: reply,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `Perfect! I'll help you with "${reply}". Let me gather some information...`,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
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
          <ChatMessage 
            key={message.id} 
            message={message} 
            onButtonClick={handleButtonClick}
            onQuickReply={handleQuickReply}
          />
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
