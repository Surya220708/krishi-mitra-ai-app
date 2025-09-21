import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Voice = () => {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: t('voice.welcome'),
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
        
        // Simulate AI response in user's language
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: getLocalizedResponse(userMessage.text),
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 2000);
        
        setIsListening(false);
      }, 3000);
    }
  };

  const getLanguageCode = () => {
    const langMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'pa': 'pa-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'gu': 'gu-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN'
    };
    return langMap[language] || 'en-IN';
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode();
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const getLocalizedResponse = (query: string) => {
    // Simulate AI response based on language
    const responses: Record<string, string> = {
      'en': "The best time to harvest wheat is when the grain moisture is between 18-20%. Look for golden-yellow color and firm grains. Early morning harvesting is ideal to avoid grain loss.",
      'hi': "गेहूं की कटाई का सबसे अच्छा समय तब है जब अनाज में नमी 18-20% के बीच हो। सुनहरे-पीले रंग और मजबूत दानों की तलाश करें। अनाज की हानि से बचने के लिए सुबह जल्दी कटाई आदर्श है।",
      'pa': "ਕਣਕ ਦੀ ਵਾਢੀ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਉਦੋਂ ਹੈ ਜਦੋਂ ਅਨਾਜ ਵਿੱਚ ਨਮੀ 18-20% ਦੇ ਵਿਚਕਾਰ ਹੋਵੇ। ਸੁਨਹਿਰੇ-ਪੀਲੇ ਰੰਗ ਅਤੇ ਮਜ਼ਬੂਤ ਦਾਣਿਆਂ ਦੀ ਖੋਜ ਕਰੋ।",
      'ta': "கோதுமை அறுவடை செய்வதற்கான சிறந்த நேரம் தானியத்தில் ஈரப்பதம் 18-20% க்கு இடையில் இருக்கும் போதுதான். தங்க-மஞ்சள் நிறம் மற்றும் உறுதியான தானியங்களைத் தேடுங்கள்।",
      'te': "గోధుమ కోత కోసం ఉత్తమ సమయం ధాన్యంలో తేమ 18-20% మధ్య ఉన్నప్పుడు. బంగారు-పసుపు రంగు మరియు గట్టి ధాన్యాలను చూడండి।",
      'gu': "ઘઉંની લણણીનો શ્રેષ્ઠ સમય જ્યારે અનાજમાં ભેજ 18-20% વચ્ચે હોય છે. સોનેરી-પીળા રંગ અને મજબૂત દાણાની શોધ કરો।",
      'mr': "गहूची कापणीची सर्वोत्तम वेळ म्हणजे जेव्हा धान्यामध्ये ओलावा 18-20% दरम्यान असतो. सोनेरी-पिवळा रंग आणि मजबूत दाणे शोधा।",
      'bn': "গমের ফসল কাটার সেরা সময় হল যখন শস্যে আর্দ্রতা 18-20% এর মধ্যে থাকে। সোনালী-হলুদ রঙ এবং শক্ত দানা খুঁজুন।"
    };
    return responses[language] || responses['en'];
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
                {isListening ? t('voice.listening') : t('voice.tapToSpeak')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isListening ? t('voice.sayQuestion') : t('voice.askAnything')}
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