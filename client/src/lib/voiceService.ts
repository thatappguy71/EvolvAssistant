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
    try {
      // Stop any current speech
      this.stop();

      const rate = options.rate || 0.75;
      const volume = options.volume || 0.8;
      const pitch = options.pitch || 1.0;

      console.log('VoiceService.speak called with:', { text, rate, volume, pitch });

      // Use enhanced Web Speech API with female voice selection
      await this.useWebSpeechAPI(text, { rate, volume, pitch });
    } catch (error) {
      console.log('Voice service error:', error);
      // Fail silently to prevent runtime errors
    }
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
          
          // Optimize settings for natural female speech
          const voiceName = femaleVoice.name.toLowerCase();
          
          if (voiceName.includes('samantha') || voiceName.includes('karen') || voiceName.includes('victoria')) {
            // Premium voices - use natural settings
            utterance.pitch = 1.0;
            utterance.rate = 0.8;
          } else if (voiceName.includes('zira') || voiceName.includes('hazel')) {
            // Microsoft voices - slight adjustments for warmth
            utterance.pitch = 1.1;
            utterance.rate = 0.75;
          } else if (voiceName.includes('google')) {
            // Google voices - optimize for clarity
            utterance.pitch = 1.0;
            utterance.rate = 0.8;
          } else if (voiceName.includes('male') || 
                     ['david', 'alex', 'daniel'].some(male => voiceName.includes(male))) {
            // Male voices - feminize with higher pitch
            utterance.pitch = 1.6;
            utterance.rate = 0.7;
          } else {
            // Default female voice optimization
            utterance.pitch = 1.2;
            utterance.rate = 0.75;
          }
        } else {
          console.log('No suitable voice found, using default with optimized settings');
          utterance.pitch = 1.4;
          utterance.rate = 0.75;
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
          // Resolve instead of reject to prevent unhandled promise rejection
          resolve();
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        console.log('Speech utterance started');
      };

      try {
        // Wait for voices to be loaded if they aren't already
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.log('Waiting for voices to load...');
          // Set a timeout in case voiceschanged never fires
          const timeout = setTimeout(() => {
            console.log('Voice loading timeout, proceeding with available voices');
            speakWithVoices();
          }, 2000);
          
          window.speechSynthesis.addEventListener('voiceschanged', () => {
            clearTimeout(timeout);
            speakWithVoices();
          }, { once: true });
        } else {
          speakWithVoices();
        }
      } catch (error) {
        console.log('Error in voice loading:', error);
        resolve();
      }
    });
  }

  private selectBestFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    console.log('Selecting from voices:', voices.map(v => ({ name: v.name, lang: v.lang })));

    // Tier 1: Premium natural female voices (most human-like)
    const premiumFemaleVoices = [
      'Samantha', 'Karen', 'Victoria', 'Allison', 'Ava', 'Susan', 'Serena',
      'Microsoft Zira Desktop', 'Google UK English Female', 'Microsoft Hazel Desktop',
      'Joanna', 'Aria', 'Emma', 'Olivia', 'Kimberly', 'Salli', 'Raveena'
    ];

    // Tier 2: Good quality female voices
    const goodFemaleVoices = [
      'Microsoft Zira', 'Google US English', 'Fiona', 'Moira', 'Tessa',
      'Veena', 'Princess', 'Vicki', 'Kate', 'Catherine'
    ];

    // Tier 3: Basic female voices
    const basicFemaleVoices = [
      'Female', 'Woman', 'en-US Female', 'en-GB Female'
    ];

    // Try premium voices first
    for (const voiceName of premiumFemaleVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) {
        console.log('Found premium female voice:', voice.name);
        return voice;
      }
    }

    // Try good quality voices
    for (const voiceName of goodFemaleVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) {
        console.log('Found good female voice:', voice.name);
        return voice;
      }
    }

    // Try basic female voices
    for (const voiceName of basicFemaleVoices) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) {
        console.log('Found basic female voice:', voice.name);
        return voice;
      }
    }

    // Advanced filtering: look for voices that are likely female
    const maleIdentifiers = ['male', 'david', 'alex', 'daniel', 'mark', 'tom', 'john', 'microsoft david', 'google male'];
    const likelyFemaleVoices = voices.filter(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      
      return (
        lang.startsWith('en') && // English voices only
        !maleIdentifiers.some(male => name.includes(male)) && // Not explicitly male
        (
          // Common female name patterns
          ['ina', 'ana', 'ella', 'ia', 'en', 'er'].some(suffix => name.endsWith(suffix)) ||
          // Or contains female indicators
          ['woman', 'girl', 'lady', 'she', 'her'].some(indicator => name.includes(indicator))
        )
      );
    });

    if (likelyFemaleVoices.length > 0) {
      // Sort by quality indicators - prefer "desktop" versions and avoid "compact"
      const sortedVoices = likelyFemaleVoices.sort((a, b) => {
        const aScore = this.getVoiceQualityScore(a.name);
        const bScore = this.getVoiceQualityScore(b.name);
        return bScore - aScore;
      });
      
      console.log('Found likely female voice:', sortedVoices[0].name);
      return sortedVoices[0];
    }

    // Last resort: return the best available English voice (avoid obviously male ones)
    const englishVoices = voices.filter(v => 
      v.lang.startsWith('en') &&
      !maleIdentifiers.some(male => v.name.toLowerCase().includes(male))
    );
    
    if (englishVoices.length > 0) {
      const bestEnglish = englishVoices.sort((a, b) => 
        this.getVoiceQualityScore(b.name) - this.getVoiceQualityScore(a.name)
      )[0];
      console.log('Using fallback English voice:', bestEnglish.name);
      return bestEnglish;
    }

    return null;
  }

  private getVoiceQualityScore(voiceName: string): number {
    const name = voiceName.toLowerCase();
    let score = 0;
    
    // Prefer desktop/enhanced versions
    if (name.includes('desktop')) score += 10;
    if (name.includes('enhanced')) score += 8;
    if (name.includes('premium')) score += 8;
    
    // Prefer Google and Microsoft voices (usually higher quality)
    if (name.includes('google')) score += 5;
    if (name.includes('microsoft')) score += 5;
    
    // Avoid compact/low-quality versions
    if (name.includes('compact')) score -= 5;
    if (name.includes('basic')) score -= 3;
    
    // Prefer common natural names
    const naturalNames = ['samantha', 'karen', 'victoria', 'allison', 'ava', 'susan'];
    if (naturalNames.some(naturalName => name.includes(naturalName))) score += 7;
    
    return score;
  }

  public stop(): void {
    try {
      // Stop Web Speech API
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      this.currentUtterance = null;
    } catch (error) {
      console.log('Error stopping voice service:', error);
    }
  }

  public isPlaying(): boolean {
    return this.currentUtterance !== null || 
           ('speechSynthesis' in window && window.speechSynthesis.speaking);
  }
}

// Export singleton instance
export const voiceService = VoiceService.getInstance();