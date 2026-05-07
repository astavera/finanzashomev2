import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

type CarPayoffAiAdviceProps = {
  aiAdvice: string | null;
  aiLoading: boolean;
  totalYearlySaved: number;
  onAskAI: () => void;
};

export function CarPayoffAiAdvice({ aiAdvice, aiLoading, totalYearlySaved, onAskAI }: CarPayoffAiAdviceProps) {
  return (
    <div className="bg-secondary/10 rounded-xl p-4 border border-border/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Recomendacion IA</span>
        </div>
        <Button size="sm" variant="outline" onClick={onAskAI} disabled={aiLoading || totalYearlySaved === 0} className="text-xs">
          {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
          {aiLoading ? 'Analizando...' : 'Deberia abonar ahora?'}
        </Button>
      </div>
      {totalYearlySaved === 0 && !aiAdvice && (
        <p className="text-xs text-muted-foreground">Marca al menos una semana de ahorro para pedir recomendacion.</p>
      )}
      {aiAdvice && (
        <div className="text-sm bg-secondary/20 rounded-lg p-3 prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{aiAdvice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
