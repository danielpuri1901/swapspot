import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, MapPin, Globe, GraduationCap, X, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ChatRoom {
  id: string;
  city: string;
  country: string;
  description: string;
}

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  created_at: string;
  user_id: string;
}

interface CityChatProps {
  room: ChatRoom;
  onBack: () => void;
  currentUser: any;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  current_location: string;
  exchange_university: string;
  university: string;
  program: string;
  nationality: string;
  languages_spoken: string[];
  interests: string;
}

export default function CityChat({ room, onBack, currentUser }: CityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
    setupRealtimeSubscription();
  }, [room.id]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_room_id', room.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`chat-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room_id=eq.${room.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(current => [...current, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, current_location, exchange_university, university, program, nationality, languages_spoken, interests')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  const handleUserNameClick = async (userId: string) => {
    if (userId === currentUser?.id) return; // Don't show popup for current user
    
    const profile = await loadUserProfile(userId);
    if (profile) {
      setSelectedUserProfile(profile);
      setShowProfilePopup(true);
    } else {
      toast.error("Could not load user profile");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || isSending) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: room.id,
          user_id: currentUser.id,
          user_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Anonymous',
          message: newMessage.trim()
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Card className="h-[700px] flex flex-col shadow-xl border-2">
        <CardHeader className="border-b bg-gradient-to-r from-swap-blue to-swap-darkBlue text-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=50&h=50&q=80"
                alt="Monument"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
              />
              <div>
                <CardTitle className="text-xl text-white">{room.city}, {room.country}</CardTitle>
                <p className="text-white/90 text-sm">{room.description}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swap-blue"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2 text-lg">No messages yet</p>
                  <p className="text-sm text-gray-400">Be the first to start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.user_id === currentUser?.id ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-10 w-10 mt-1 shadow-md">
                    <AvatarFallback className="bg-swap-blue text-white font-semibold">
                      {message.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] ${
                      message.user_id === currentUser?.id
                        ? 'bg-swap-blue text-white'
                        : 'bg-white border border-gray-200'
                    } rounded-2xl p-4 shadow-md`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => handleUserNameClick(message.user_id)}
                        className={`font-semibold text-sm hover:underline cursor-pointer ${
                          message.user_id === currentUser?.id 
                            ? 'text-white hover:text-blue-100' 
                            : 'text-swap-blue hover:text-swap-darkBlue'
                        }`}
                      >
                        {message.user_name}
                      </button>
                      <span className={`text-xs ${
                        message.user_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      message.user_id === currentUser?.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {message.message}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-6 bg-white">
            <div className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1 h-12 border-2 focus:border-swap-blue"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || isSending}
                size="lg"
                className="bg-swap-blue hover:bg-swap-darkBlue px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Popup */}
      {showProfilePopup && selectedUserProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Student Profile</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfilePopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-swap-blue text-white font-semibold text-lg">
                    {selectedUserProfile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedUserProfile.full_name || 'Anonymous User'}</h4>
                  <p className="text-sm text-gray-600">{selectedUserProfile.program || 'Student'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedUserProfile.nationality && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-swap-blue flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-medium">Nationality:</span> {selectedUserProfile.nationality}
                    </span>
                  </div>
                )}
                
                {selectedUserProfile.languages_spoken && selectedUserProfile.languages_spoken.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4 text-swap-blue flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-medium">Languages:</span> {selectedUserProfile.languages_spoken.join(', ')}
                    </span>
                  </div>
                )}

                {selectedUserProfile.current_location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-swap-blue flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-medium">Currently in:</span> {selectedUserProfile.current_location}
                    </span>
                  </div>
                )}
                
                {selectedUserProfile.exchange_university && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-swap-blue flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-medium">Going to:</span> {selectedUserProfile.exchange_university}
                    </span>
                  </div>
                )}

                {selectedUserProfile.interests && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-700">
                      <span className="font-medium">Interests:</span> {selectedUserProfile.interests}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
