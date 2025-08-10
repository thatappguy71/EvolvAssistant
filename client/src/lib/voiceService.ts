// Voice Service for consistent female voice across all devices
// This service provides multiple TTS providers with fallbacks

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class VoiceService {
  private static instance: VoiceService;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {}

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public async speak(text: string, options: VoiceOptions = {}): Promise<void> {
    // Stop any current speech
    this.stop();

    const rate = options.rate || 0.75;
    const volume = options.volume || 0.8;
    const pitch = options.pitch || 1.0;

    console.log('VoiceService.speak called with:', { text, rate, volume, pitch });

    // Use enhanced Web Speech API with female voice selection
    return this.useWebSpeechAPI(text, { rate, volume, pitch });
  }

  private useWebSpeechAPI(text: string, options: VoiceOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const speakWithVoices = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.75;
        utterance.pitch = options.pitch || 1.4; // Higher for feminine sound
        utterance.volume = options.volume || 0.8;

        // Enhanced female voice selection
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length, voices.map(v => v.name));
        
        const femaleVoice = this.selectBestFemaleVoice(voices);
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
          console.log('Selected voice:', femaleVoice.name);
          // Adjust pitch based on voice type
          if (femaleVoice.name.toLowerCase().includes('male') || 
              ['david', 'alex', 'daniel'].some(male => femaleVoice.name.toLowerCase().includes(male))) {
            utterance.pitch = 1.6; // High pitch for male voices to sound feminine
          }
        } else {
          console.log('No suitable voice found, using default with high pitch');
          utterance.pitch = 1.6; // Extra high pitch as fallback
        }

        utterance.onstart = () => {
          console.log('Speech started');
        };

        utterance.onend = () => {
          console.log('Speech ended');
          this.currentUtterance = null;
          resolve();
        };

        utterance.onerror = (error) => {
          console.log('Speech error:', error);
          this.currentUtterance = null;
          reject(error);
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        console.log('Speech utterance started');
      };

      // Wait for voices to be loaded if they aren't already
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        console.log('Waiting for voices to load...');
        window.speechSynthesis.addEventListener('voiceschanged', speakWithVoices, { once: true });
      } else {
        speakWithVoices();
      }
    });
  }

  private selectBestFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    console.log('Selecting from voices:', voices.map(v => ({ name: v.name, lang: v.lang })));

    // Priority list of female voices (most natural first)
    const preferredFemaleVoices = [
      'Microsoft Zira', 'Google UK English Female', 'Samantha', 'Karen', 'Serena', 'Victoria',
      'Allison', 'Ava', 'Susan', 'Joanna', 'Aria', 'Emma', 'Olivia', 'Kimberly', 'Salli'
    ];

    // Try to find preferred voices first
    for (const voiceName of preferredFemaleVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) {
        console.log('Found preferred female voice:', voice.name);
        return voice;
      }
    }

    // Look for any voice explicitly labeled as female
    const explicitFemaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman')
    );
    if (explicitFemaleVoice) {
      console.log('Found explicit female voice:', explicitFemaleVoice.name);
      return explicitFemaleVoice;
    }

    // Filter out known male voices and take an English voice
    const maleIdentifiers = ['male', 'david', 'alex', 'daniel', 'mark', 'tom', 'john', 'microsoft david'];
    const nonMaleVoices = voices.filter(v => 
      v.lang.startsWith('en') &&
      !maleIdentifiers.some(male => v.name.toLowerCase().includes(male.toLowerCase()))
    );

    if (nonMaleVoices.length > 0) {
      // Prefer voices that sound more feminine (usually index 1 or 2)
      const selectedVoice = nonMaleVoices[Math.min(1, nonMaleVoices.length - 1)] || nonMaleVoices[0];
      console.log('Found non-male voice:', selectedVoice.name);
      return selectedVoice;
    }

    // Last resort: return any English voice
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      console.log('Using fallback English voice:', englishVoice.name);
    }
    return englishVoice || null;
  }

  public stop(): void {
    // Stop Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.currentUtterance = null;
  }

  public isPlaying(): boolean {
    return this.currentUtterance !== null || 
           ('speechSynthesis' in window && window.speechSynthesis.speaking);
  }
}

// Export singleton instance
export const voiceService = VoiceService.getInstance();