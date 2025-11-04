export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log('Starting audio recorder...');
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('Audio recorder started successfully');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    console.log('Stopping audio recorder...');
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    console.log('Audio recorder stopped');
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = createWavFromPCM(audioData);
      // Create a new ArrayBuffer to ensure compatibility
      const arrayBuffer = new ArrayBuffer(wavData.byteLength);
      const view = new Uint8Array(arrayBuffer);
      view.set(wavData);
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext();
    }
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
  }
}

let audioQueueInstance: AudioQueue | null = null;

export const playAudioData = async (audioContext: AudioContext, audioData: Uint8Array) => {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueue(audioContext);
  }
  await audioQueueInstance.addToQueue(audioData);
};

export const clearAudioQueue = () => {
  if (audioQueueInstance) {
    audioQueueInstance.clear();
  }
};

export interface VoiceMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export class VoiceChatManager {
  private ws: WebSocket | null = null;
  private audioRecorder: AudioRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private isConnected = false;
  private currentTranscript = '';
  private accumulatedAudio: Uint8Array[] = [];

  constructor(
    private language: string,
    private onMessage: (message: VoiceMessage) => void,
    private onConnectionChange: (connected: boolean) => void,
    private onError: (error: string) => void
  ) {}

  async connect() {
    try {
      console.log('Connecting voice chat for language:', this.language);
      
      // Initialize audio context
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      
      // Connect to edge function WebSocket
      const wsUrl = `wss://fepwfqrklwpakfmscdkb.supabase.co/functions/v1/voice-chat?language=${this.language}`;
      console.log('Connecting to:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = async () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.onConnectionChange(true);

        // Start audio recording
        this.audioRecorder = new AudioRecorder((audioData) => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            const encoded = encodeAudioForAPI(audioData);
            this.ws.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encoded
            }));
          }
        });

        await this.audioRecorder.start();
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received event type:', data.type);

          switch (data.type) {
            case 'response.audio.delta':
              const binaryString = atob(data.delta);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              this.accumulatedAudio.push(bytes);
              if (this.audioContext) {
                await playAudioData(this.audioContext, bytes);
              }
              break;

            case 'response.audio_transcript.delta':
              this.currentTranscript += data.delta;
              break;

            case 'response.audio_transcript.done':
              if (this.currentTranscript) {
                this.onMessage({
                  id: Date.now().toString(),
                  text: this.currentTranscript,
                  isUser: false,
                  timestamp: new Date()
                });
                this.currentTranscript = '';
              }
              this.accumulatedAudio = [];
              break;

            case 'conversation.item.input_audio_transcription.completed':
              if (data.transcript) {
                this.onMessage({
                  id: Date.now().toString(),
                  text: data.transcript,
                  isUser: true,
                  timestamp: new Date()
                });
              }
              break;

            case 'error':
              console.error('WebSocket error event:', data);
              this.onError(data.error || 'Unknown error occurred');
              break;
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onError('Connection error occurred');
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.isConnected = false;
        this.onConnectionChange(false);
        this.cleanup();
      };

    } catch (error) {
      console.error('Error connecting:', error);
      this.onError(error instanceof Error ? error.message : 'Failed to connect');
      throw error;
    }
  }

  disconnect() {
    console.log('Disconnecting voice chat');
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private cleanup() {
    if (this.audioRecorder) {
      this.audioRecorder.stop();
      this.audioRecorder = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    clearAudioQueue();
    this.currentTranscript = '';
    this.accumulatedAudio = [];
  }

  sendTextMessage(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.onError('Not connected');
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));

    this.ws.send(JSON.stringify({ type: 'response.create' }));

    this.onMessage({
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    });
  }

  isConnectedStatus(): boolean {
    return this.isConnected;
  }
}
