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

    // Try ResponsiveVoice first (most consistent)
    if (await this.tryResponsiveVoice(text, { rate, volume, pitch })) {
      return;
    }

    // Fallback to enhanced Web Speech API
    return this.useWebSpeechAPI(text, { rate, volume, pitch });
  }

  private async tryResponsiveVoice(text: string, options: VoiceOptions): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
        const voiceOptions = {
          rate: options.rate,
          pitch: options.pitch,
          volume: options.volume,
          onend: () => console.log('ResponsiveVoice playback complete'),
          onerror: (error: any) => console.log('ResponsiveVoice error:', error)
        };

        // Use the most natural female voice available
        (window as any).responsiveVoice.speak(text, "UK English Female", voiceOptions);
        console.log('Using ResponsiveVoice UK English Female');
        return true;
      }
    } catch (error) {
      console.log('ResponsiveVoice not available:', error);
    }
    return false;
  }

  private useWebSpeechAPI(text: string, options: VoiceOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.75;
      utterance.pitch = options.pitch || 1.4; // Higher for feminine sound
      utterance.volume = options.volume || 0.8;

      // Enhanced female voice selection
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = this.selectBestFemaleVoice(voices);
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('Selected female voice:', femaleVoice.name);
      } else {
        console.log('No female voice found, using default with high pitch');
        utterance.pitch = 1.6; // Extra high pitch as fallback
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (error) => {
        this.currentUtterance = null;
        reject(error);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  private selectBestFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    // Priority list of female voices (most natural first)
    const preferredVoices = [
      'Microsoft Zira', 'Samantha', 'Karen', 'Serena', 'Victoria',
      'Allison', 'Ava', 'Susan', 'Joanna', 'Aria', 'Emma', 'Olivia'
    ];

    // Try to find preferred voices
    for (const voiceName of preferredVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) return voice;
    }

    // Fallback: find any female-labeled voice
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman')
    );
    if (femaleVoice) return femaleVoice;

    // Last resort: find non-male English voice
    const maleIdentifiers = ['male', 'david', 'alex', 'daniel', 'mark', 'tom', 'john'];
    return voices.find(v => 
      v.lang.startsWith('en') &&
      !maleIdentifiers.some(male => v.name.toLowerCase().includes(male))
    ) || null;
  }

  public stop(): void {
    // Stop ResponsiveVoice
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      try {
        (window as any).responsiveVoice.cancel();
      } catch (error) {
        console.log('Error stopping ResponsiveVoice:', error);
      }
    }

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