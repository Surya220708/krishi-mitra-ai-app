import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/navigation";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Voice = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Namaste! I'm your KrishiMitra AI assistant. How can I help you with your farming today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "What's the best time to harvest wheat?",
          isUser: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: "The best time to harvest wheat is when the grain moisture is between 18-20%. Look for golden-yellow color and firm grains. Early morning harvesting is ideal to avoid grain loss.",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 2000);
        
        setIsListening(false);
      }, 3000);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech first
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Wait for voices to load if needed
      const speak = () => {
        speechSynthesis.speak(utterance);
      };
      
      if (speechSynthesis.getVoices().length > 0) {
        speak();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          speak();
        };
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pt-12">
        <h1 className="text-2xl font-bold mb-2 animate-fade-in">Voice Advisory</h1>
        <p className="text-primary-foreground/90">
          Speak in Hindi, English, or Punjabi
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {!message.isUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.text)}
                        className="h-6 w-6 p-0 hover:bg-primary/10"
                      >
                        <Volume2 size={12} className="text-primary" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
        
        {isListening && (
          <div className="flex justify-start animate-slide-up">
            <Card className="bg-card mr-4 p-4 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow"></div>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Voice Input Button */}
      <div className="fixed bottom-24 left-6 right-6 z-40">
        <Card className="p-6 bg-card/95 backdrop-blur border border-primary/20">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse-glow' 
                  : 'bg-primary hover:bg-primary/90'
              } text-primary-foreground shadow-lg transition-all duration-300 transform hover:scale-110`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </Button>
            
            <div className="text-center">
              <p className="font-semibold text-foreground">
                {isListening ? "Listening..." : "Tap to speak"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isListening ? "Say your farming question" : "Ask anything about farming"}
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