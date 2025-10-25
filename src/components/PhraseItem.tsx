import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState } from "react";

interface PhraseItemProps {
  english: string;
  translation: string;
  languageCode?: string;
}

export const PhraseItem = ({ english, translation, languageCode = "fr-FR" }: PhraseItemProps) => {
  const [playingEnglish, setPlayingEnglish] = useState(false);
  const [playingTranslation, setPlayingTranslation] = useState(false);

  const handleSpeak = (text: string, lang: string, setPlaying: (val: boolean) => void) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group">
      <div className="flex-1 grid md:grid-cols-2 gap-4">
        {/* English */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleSpeak(english, "en-US", setPlayingEnglish)}
            size="icon"
            variant="ghost"
            className={`shrink-0 transition-all duration-300 ${
              playingEnglish 
                ? 'bg-primary text-primary-foreground scale-110' 
                : 'hover:bg-primary/10 hover:text-primary hover:scale-105'
            }`}
            aria-label={`Play English: ${english}`}
          >
            <Volume2 className={`h-4 w-4 ${playingEnglish ? 'animate-pulse' : ''}`} />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">English</p>
            <p className="text-foreground font-medium">{english}</p>
          </div>
        </div>

        {/* Translation */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleSpeak(translation, languageCode, setPlayingTranslation)}
            size="icon"
            variant="ghost"
            className={`shrink-0 transition-all duration-300 ${
              playingTranslation 
                ? 'bg-accent text-accent-foreground scale-110' 
                : 'hover:bg-accent/10 hover:text-accent hover:scale-105'
            }`}
            aria-label={`Play French: ${translation}`}
          >
            <Volume2 className={`h-4 w-4 ${playingTranslation ? 'animate-pulse' : ''}`} />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">French</p>
            <p className="text-foreground font-semibold text-accent">{translation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
