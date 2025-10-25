import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhraseItem } from "@/components/PhraseItem";
import { NumberPractice } from "@/components/NumberPractice";
import { MessageSquare } from "lucide-react";
import phrasesData from "@/data/phrases.json";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Language Learning
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn English and {phrasesData.targetLanguage}. Click the play buttons to hear native pronunciation!
          </p>
        </header>

        {/* Tabs */}
        <Tabs defaultValue={phrasesData.tabs[0].id} className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-card/50 backdrop-blur-sm p-2 h-auto">
            {phrasesData.tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 py-3 rounded-lg font-medium"
              >
                {tab.title}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="numbers"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 py-3 rounded-lg font-medium"
            >
              Numbers
            </TabsTrigger>
          </TabsList>

          {phrasesData.tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="mt-8 space-y-3 animate-in fade-in-50 duration-500"
            >
              {tab.items.map((item, index) => (
                <PhraseItem 
                  key={index} 
                  english={item.english} 
                  translation={item.translation}
                  languageCode={phrasesData.targetLanguageCode}
                />
              ))}
            </TabsContent>
          ))}

          <TabsContent 
            value="numbers"
            className="mt-8 animate-in fade-in-50 duration-500"
          >
            <NumberPractice 
              languageCode={phrasesData.targetLanguageCode}
              languageName={phrasesData.targetLanguage}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Using Web Speech API for text-to-speech functionality</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
