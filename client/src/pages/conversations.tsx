import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MessageSquare, Phone, Filter, X } from "lucide-react";
import { useGlobalShortcuts } from "@/hooks/use-keyboard-shortcuts";
import type { Conversation } from "@shared/schema";

const statusColors = {
  active: "bg-green-100 text-green-800",
  resolved: "bg-blue-100 text-blue-800", 
  pending: "bg-yellow-100 text-yellow-800",
};

export default function Conversations() {
  useGlobalShortcuts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    
    return conversations.filter(conversation => {
      const matchesSearch = searchTerm === "" || 
        conversation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.customerPhone.includes(searchTerm) ||
        conversation.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Conversations</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Manage and monitor all customer conversations</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            data-testid="search-input"
            placeholder="Search conversations, names, or messages... (Press / or Ctrl+K)" 
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchTerm("")}
              data-testid="button-clear-search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]" data-testid="select-status-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-whatsapp-primary hover:bg-whatsapp-secondary touch-manipulation" data-testid="button-new-conversation">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Conversation</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || statusFilter !== "all") && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchTerm("")}
              />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setStatusFilter("all")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Summary */}
      {filteredConversations && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredConversations.length} of {conversations?.length || 0} conversations
        </div>
      )}

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations?.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.customerAvatar || undefined} />
                  <AvatarFallback>
                    {conversation.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">
                      {conversation.customerName}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessageTime 
                        ? new Date(conversation.lastMessageTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : ''
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {conversation.customerPhone}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[conversation.status as keyof typeof statusColors]}>
                      {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-whatsapp-primary"
                      data-testid={`button-view-chat-${conversation.id}`}
                    >
                      View Chat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty States */}
      {(!conversations || conversations.length === 0) && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">Start your first conversation with a customer</p>
          </CardContent>
        </Card>
      )}

      {filteredConversations?.length === 0 && conversations && conversations.length > 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              data-testid="button-reset-search"
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
