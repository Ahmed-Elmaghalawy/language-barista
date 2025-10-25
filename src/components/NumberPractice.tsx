import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2 } from "lucide-react";
import { useState } from "react";

interface NumberPracticeProps {
  languageCode?: string;
  languageName?: string;
}

export const NumberPractice = ({ languageCode = "fr-FR", languageName = "French" }: NumberPracticeProps) => {
  const [number, setNumber] = useState("");
  const [playingEnglish, setPlayingEnglish] = useState(false);
  const [playingTranslation, setPlayingTranslation] = useState(false);

  const handleSpeak = (text: string, lang: string, setPlaying: (val: boolean) => void) => {
    if ('speechSynthesis' in window && text.trim()) {
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Number Practice</h3>
        <p className="text-sm text-muted-foreground">Type any number to hear it spoken in both languages</p>
      </div>

      <div className="flex items-center gap-3 p-5 rounded-xl bg-card border border-border">
        <Input
          type="text"
          placeholder="Type a number (e.g., 42, 100, 2024)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="flex-1 text-lg"
        />
      </div>

      {number.trim() && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* English */}
          <div className="flex items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
            <Button
              onClick={() => handleSpeak(number, "en-US", setPlayingEnglish)}
              size="icon"
              variant="ghost"
              className={`shrink-0 transition-all duration-300 ${
                playingEnglish 
                  ? 'bg-primary text-primary-foreground scale-110' 
                  : 'hover:bg-primary/10 hover:text-primary hover:scale-105'
              }`}
              aria-label={`Play English: ${number}`}
            >
              <Volume2 className={`h-4 w-4 ${playingEnglish ? 'animate-pulse' : ''}`} />
            </Button>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">English</p>
              <p className="text-foreground font-medium text-lg">{number}</p>
            </div>
          </div>

          {/* Translation */}
          <div className="flex items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
            <Button
              onClick={() => handleSpeak(number, languageCode, setPlayingTranslation)}
              size="icon"
              variant="ghost"
              className={`shrink-0 transition-all duration-300 ${
                playingTranslation 
                  ? 'bg-accent text-accent-foreground scale-110' 
                  : 'hover:bg-accent/10 hover:text-accent hover:scale-105'
              }`}
              aria-label={`Play ${languageName}: ${number}`}
            >
              <Volume2 className={`h-4 w-4 ${playingTranslation ? 'animate-pulse' : ''}`} />
            </Button>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{languageName}</p>
              <p className="text-foreground font-semibold text-accent text-lg">{number}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
