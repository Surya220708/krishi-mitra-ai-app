import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set');
}

const languageInstructions: Record<string, string> = {
  'en': "You are a helpful agricultural assistant for Indian farmers. Provide practical farming advice about crops, soil, weather, and modern farming techniques. Keep responses concise and actionable.",
  'hi': "आप भारतीय किसानों के लिए एक सहायक कृषि सहायक हैं। फसलों, मिट्टी, मौसम और आधुनिक कृषि तकनीकों के बारे में व्यावहारिक कृषि सलाह प्रदान करें। उत्तर संक्षिप्त और कार्रवाई योग्य रखें।",
  'pa': "ਤੁਸੀਂ ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਇੱਕ ਸਹਾਇਕ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹੋ। ਫਸਲਾਂ, ਮਿੱਟੀ, ਮੌਸਮ ਅਤੇ ਆਧੁਨਿਕ ਖੇਤੀਬਾੜੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਵਿਹਾਰਕ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਪ੍ਰਦਾਨ ਕਰੋ।",
  'ta': "நீங்கள் இந்திய விவசாயிகளுக்கான உதவிகரமான விவசாய உதவியாளர். பயிர்கள், மண், வானிலை மற்றும் நவீன விவசாய நுட்பங்கள் பற்றிய நடைமுறை விவசாய ஆலோசனைகளை வழங்குங்கள்.",
  'te': "మీరు భారతీయ రైతులకు సహాయక వ్యవసాయ సహాయకుడు. పంటలు, మట్టి, వాతావరణం మరియు ఆధునిక వ్యవసాయ పద్ధతుల గురించి ఆచరణాత్మక వ్యవసాయ సలహా అందించండి।",
  'gu': "તમે ભારતીય ખેડૂતો માટે એક સહાયક કૃષિ સહાયક છો। પાક, માટી, હવામાન અને આધુનિક ખેતી તકનીકો વિશે વ્યવહારુ ખેતી સલાહ પ્રદાન કરો।",
  'mr': "तुम्ही भारतीय शेतकऱ्यांसाठी एक उपयुक्त कृषी सहाय्यक आहात. पिके, माती, हवामान आणि आधुनिक शेती तंत्रे याविषयी व्यावहारिक शेती सल्ला द्या.",
  'bn': "আপনি ভারতীয় কৃষকদের জন্য একজন সহায়ক কৃষি সহায়ক। ফসল, মাটি, আবহাওয়া এবং আধুনিক চাষাবাদ কৌশল সম্পর্কে ব্যবহারিক কৃষি পরামর্শ প্রদান করুন।"
};

Deno.serve(async (req) => {
  console.log('Voice chat request received:', req.method, req.url);

  // Handle WebSocket upgrade
  if (req.headers.get("upgrade") === "websocket") {
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    // Get language from query params
    const url = new URL(req.url);
    const language = url.searchParams.get('language') || 'en';
    console.log('WebSocket upgrade for language:', language);

    let openaiWs: WebSocket | null = null;
    let sessionCreated = false;

    clientSocket.onopen = async () => {
      console.log('Client WebSocket opened');
      
      try {
        // Connect to OpenAI Realtime API
        const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
        console.log('Connecting to OpenAI:', openaiUrl);
        
        openaiWs = new WebSocket(openaiUrl, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        });

        openaiWs.onopen = () => {
          console.log('Connected to OpenAI Realtime API');
        };

        openaiWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('OpenAI event type:', data.type);

            // Send session.update after session.created
            if (data.type === 'session.created' && !sessionCreated) {
              sessionCreated = true;
              console.log('Session created, sending session.update');
              
              const sessionUpdate = {
                type: 'session.update',
                session: {
                  modalities: ['text', 'audio'],
                  instructions: languageInstructions[language] || languageInstructions['en'],
                  voice: 'alloy',
                  input_audio_format: 'pcm16',
                  output_audio_format: 'pcm16',
                  input_audio_transcription: {
                    model: 'whisper-1'
                  },
                  turn_detection: {
                    type: 'server_vad',
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 1000
                  },
                  temperature: 0.8,
                  max_response_output_tokens: 'inf'
                }
              };
              
              openaiWs?.send(JSON.stringify(sessionUpdate));
            }

            // Forward all events to client
            clientSocket.send(event.data);
          } catch (error) {
            console.error('Error processing OpenAI message:', error);
          }
        };

        openaiWs.onerror = (error) => {
          console.error('OpenAI WebSocket error:', error);
          clientSocket.send(JSON.stringify({ 
            type: 'error', 
            error: 'Connection to AI service failed' 
          }));
        };

        openaiWs.onclose = () => {
          console.log('OpenAI WebSocket closed');
          clientSocket.close();
        };

      } catch (error) {
        console.error('Error connecting to OpenAI:', error);
        clientSocket.send(JSON.stringify({ 
          type: 'error', 
          error: error instanceof Error ? error.message : 'Failed to connect to AI service' 
        }));
      }
    };

    clientSocket.onmessage = (event) => {
      try {
        // Forward client messages to OpenAI
        if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.send(event.data);
        } else {
          console.error('OpenAI WebSocket not ready');
        }
      } catch (error) {
        console.error('Error forwarding message to OpenAI:', error);
      }
    };

    clientSocket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    clientSocket.onclose = () => {
      console.log('Client WebSocket closed');
      if (openaiWs) {
        openaiWs.close();
      }
    };

    return response;
  }

  return new Response('Expected WebSocket upgrade', { status: 400 });
});
