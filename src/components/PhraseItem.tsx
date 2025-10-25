import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState } from "react";

interface PhraseItemProps {
  text: string;
}

export const PhraseItem = ({ text }: PhraseItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 group">
      <span className="text-foreground font-medium text-lg">{text}</span>
      <Button
        onClick={handleSpeak}
        size="icon"
        variant="ghost"
        className={`shrink-0 transition-all duration-300 ${
          isPlaying 
            ? 'bg-accent text-accent-foreground scale-110' 
            : 'hover:bg-accent/10 hover:text-accent hover:scale-105'
        }`}
        aria-label={`Play ${text}`}
      >
        <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </Button>
    </div>
  );
};
