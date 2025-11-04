import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { VoiceChatManager, VoiceMessage } from "@/utils/voiceChat";
import { useToast } from "@/hooks/use-toast";

const Voice = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const voiceChatRef = useRef<VoiceChatManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup on unmount or language change
  useEffect(() => {
    return () => {
      if (voiceChatRef.current) {
        voiceChatRef.current.disconnect();
        voiceChatRef.current = null;
      }
    };
  }, [language]);

  const handleMessage = (message: VoiceMessage) => {
    console.log('New message:', message);
    setMessages(prev => [...prev, message]);
  };

  const handleConnectionChange = (connected: boolean) => {
    console.log('Connection status:', connected);
    setIsConnected(connected);
    setIsConnecting(false);
    
    if (connected) {
      toast({
        title: t('voice.connected'),
        description: t('voice.startSpeaking'),
      });
    }
  };

  const handleError = (error: string) => {
    console.error('Voice chat error:', error);
    toast({
      title: t('voice.error'),
      description: error,
      variant: "destructive",
    });
    setIsConnecting(false);
    setIsConnected(false);
  };

  const toggleVoiceChat = async () => {
    if (isConnected) {
      // Disconnect
      if (voiceChatRef.current) {
        voiceChatRef.current.disconnect();
        voiceChatRef.current = null;
      }
      setIsConnected(false);
      toast({
        title: t('voice.disconnected'),
        description: t('voice.sessionEnded'),
      });
    } else {
      // Connect
      try {
        setIsConnecting(true);
        
        voiceChatRef.current = new VoiceChatManager(
          language,
          handleMessage,
          handleConnectionChange,
          handleError
        );
        
        await voiceChatRef.current.connect();
      } catch (error) {
        console.error('Failed to connect:', error);
        handleError(error instanceof Error ? error.message : 'Failed to connect');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pt-12">
        <h1 className="text-2xl font-bold mb-2 animate-fade-in">{t('voice.title')}</h1>
        <p className="text-primary-foreground/90">
          {t('voice.subtitle')}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <MessageCircle size={48} className="mx-auto text-primary/40 mb-4" />
            <p className="text-muted-foreground">{t('voice.noMessages')}</p>
            <p className="text-sm text-muted-foreground mt-2">{t('voice.tapToStart')}</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.isUser 
                ? 'bg-primary text-primary-foreground ml-4' 
                : 'bg-card mr-4 border border-primary/20'
            }`}>
              <div className="flex items-start gap-3">
                {!message.isUser && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle size={16} className="text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <span className={`text-xs ${
                    message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
        
        {isConnected && (
          <div className="flex justify-center animate-slide-up">
            <Card className="bg-primary/10 px-4 py-2 border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">{t('voice.listening')}</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Input Button */}
      <div className="fixed bottom-24 left-6 right-6 z-40">
        <Card className="p-6 bg-card/95 backdrop-blur border border-primary/20">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={toggleVoiceChat}
              disabled={isConnecting}
              className={`w-20 h-20 rounded-full ${
                isConnected 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse-glow' 
                  : 'bg-primary hover:bg-primary/90'
              } text-primary-foreground shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50`}
            >
              {isConnecting ? (
                <Loader2 size={32} className="animate-spin" />
              ) : isConnected ? (
                <MicOff size={32} />
              ) : (
                <Mic size={32} />
              )}
            </Button>
            
            <div className="text-center">
              <p className="font-semibold text-foreground">
                {isConnecting 
                  ? t('voice.connecting') 
                  : isConnected 
                    ? t('voice.tapToStop') 
                    : t('voice.tapToSpeak')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected 
                  ? t('voice.speakNow') 
                  : t('voice.askAnything')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Voice;