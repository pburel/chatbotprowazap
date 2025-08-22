import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MapPin, FileText, Download, Play, Image, List, ExternalLink, Check, CheckCheck } from "lucide-react";

interface WhatsAppButton {
  id: string;
  title: string;
  type?: 'reply' | 'url' | 'call';
  url?: string;
  phone?: string;
}

interface WhatsAppListItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

interface WhatsAppList {
  title: string;
  description?: string;
  buttonText: string;
  items: WhatsAppListItem[];
}

interface WhatsAppMedia {
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  filename?: string;
  caption?: string;
  thumbnail?: string;
}

interface WhatsAppLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

interface Message {
  id: number;
  text?: string;
  isUser: boolean;
  time: string;
  messageType?: 'text' | 'interactive' | 'list' | 'media' | 'location';
  
  // Rich content types
  buttons?: WhatsAppButton[];
  quickReplies?: string[];
  list?: WhatsAppList;
  media?: WhatsAppMedia;
  location?: WhatsAppLocation;
  
  // Legacy support
  options?: string[];
}

interface ChatMessageProps {
  message: Message;
  onButtonClick?: (buttonId: string, buttonText: string) => void;
  onQuickReply?: (reply: string) => void;
}

export default function ChatMessage({ message, onButtonClick, onQuickReply }: ChatMessageProps) {
  const renderButtons = () => {
    if (!message.buttons) return null;
    
    return (
      <div className="mt-3 space-y-2">
        {message.buttons.map((button) => (
          <Button
            key={button.id}
            variant="outline"
            size="sm"
            className={cn(
              "w-full text-left justify-start text-xs h-auto py-2 touch-manipulation",
              message.isUser
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-border hover:bg-accent"
            )}
            onClick={() => onButtonClick?.(button.id, button.title)}
            data-testid={`button-${button.id}`}
          >
            <div className="flex items-center space-x-2">
              {button.type === 'url' && <ExternalLink className="h-3 w-3" />}
              {button.type === 'call' && <span className="text-xs">📞</span>}
              <span>{button.title}</span>
            </div>
          </Button>
        ))}
      </div>
    );
  };

  const renderQuickReplies = () => {
    if (!message.quickReplies) return null;
    
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {message.quickReplies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={cn(
              "text-xs rounded-full h-auto px-3 py-1 touch-manipulation",
              message.isUser
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-border hover:bg-accent"
            )}
            onClick={() => onQuickReply?.(reply)}
            data-testid={`quick-reply-${index}`}
          >
            {reply}
          </Button>
        ))}
      </div>
    );
  };

  const renderList = () => {
    if (!message.list) return null;
    
    return (
      <div className="mt-3">
        <div className="mb-3">
          <h4 className="font-medium text-sm">{message.list.title}</h4>
          {message.list.description && (
            <p className="text-xs opacity-80 mt-1">{message.list.description}</p>
          )}
        </div>
        
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {message.list.items.map((item, index) => (
            <div key={item.id}>
              <div 
                className="flex items-center space-x-3 p-2 rounded hover:bg-black/5 cursor-pointer touch-manipulation"
                onClick={() => onButtonClick?.(item.id, item.title)}
                data-testid={`list-item-${item.id}`}
              >
                {item.icon && <span className="text-sm">{item.icon}</span>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-xs opacity-70 truncate">{item.description}</p>
                  )}
                </div>
              </div>
              {index < message.list!.items.length - 1 && (
                <Separator className="my-1" />
              )}
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 touch-manipulation"
          data-testid="list-button"
        >
          <List className="h-3 w-3 mr-2" />
          {message.list.buttonText}
        </Button>
      </div>
    );
  };

  const renderMedia = () => {
    if (!message.media) return null;
    
    return (
      <div className="mt-2 mb-2">
        {message.media.type === 'image' && (
          <div className="relative">
            <img 
              src={message.media.url} 
              alt="Shared image"
              className="max-w-full h-auto rounded-lg max-h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
              <Image className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
        
        {message.media.type === 'document' && (
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-accent/20">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.media.filename}</p>
              <p className="text-xs opacity-70">Document</p>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {(message.media.type === 'audio' || message.media.type === 'video') && (
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-accent/20">
            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
              <Play className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {message.media.type === 'audio' ? 'Voice Message' : 'Video Message'}
              </p>
              <p className="text-xs opacity-70">Tap to play</p>
            </div>
          </div>
        )}
        
        {message.media.caption && (
          <p className="text-sm mt-2">{message.media.caption}</p>
        )}
      </div>
    );
  };

  const renderLocation = () => {
    if (!message.location) return null;
    
    return (
      <div className="mt-2 mb-2">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 relative flex items-center justify-center">
            <MapPin className="h-8 w-8 text-green-600" />
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded p-2">
              <p className="text-xs font-medium">{message.location.name || 'Shared Location'}</p>
              {message.location.address && (
                <p className="text-xs opacity-70">{message.location.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Legacy options support
  const renderLegacyOptions = () => {
    if (!message.options) return null;
    
    return (
      <div className="mt-3 space-y-2">
        {message.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={cn(
              "w-full text-left justify-start text-xs h-auto py-2 touch-manipulation",
              message.isUser
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-border hover:bg-accent"
            )}
            onClick={() => onQuickReply?.(option)}
            data-testid={`legacy-option-${index}`}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs rounded-lg p-3 shadow-sm ${
          message.isUser
            ? 'chat-bubble-user text-whatsapp-dark'
            : 'chat-bubble-bot'
        }`}
      >
        {/* Media content first */}
        {renderMedia()}
        
        {/* Location content */}
        {renderLocation()}
        
        {/* Text content */}
        {message.text && (
          <p className="text-sm">{message.text}</p>
        )}
        
        {/* Interactive elements */}
        {renderList()}
        {renderButtons()}
        {renderQuickReplies()}
        {renderLegacyOptions()}
        
        {/* Timestamp and status */}
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