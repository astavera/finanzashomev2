import { useState } from 'react';
import { Loader2, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type CarPayoffAiAdviceProps = {
  aiAdvice: string | null;
  aiLoading: boolean;
  totalYearlySaved: number;
  onAskAI: (question: string) => void;
};

export function CarPayoffAiAdvice({ aiAdvice, aiLoading, totalYearlySaved, onAskAI }: CarPayoffAiAdviceProps) {
  const [question, setQuestion] = useState('Me conviene abonar ahora o esperar a diciembre?');
  const canAsk = question.trim().length > 0 && !aiLoading;

  const handleAsk = () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    onAskAI(trimmedQuestion);
  };

  return (
    <div className="rounded-xl border border-border/30 bg-secondary/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">Preguntale a la IA</span>
      </div>

      <div className="space-y-3">
        <Textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-20 bg-secondary/20"
          placeholder="Ej: Si pago $500 extra esta semana, cuanto interes ahorro?"
          disabled={aiLoading}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            La IA usa tu deuda actual, abonos aplicados, cuota mensual y ahorro disponible.
          </p>
          <Button size="sm" variant="outline" onClick={handleAsk} disabled={!canAsk} className="shrink-0 text-xs">
            {aiLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Send className="mr-1 h-3 w-3" />}
            {aiLoading ? 'Analizando...' : 'Preguntar'}
          </Button>
        </div>
      </div>

      {totalYearlySaved === 0 && !aiAdvice && (
        <p className="mt-3 text-xs text-muted-foreground">
          Todavia puedes preguntar, pero marca abonos para una recomendacion mas precisa.
        </p>
      )}

      {aiAdvice && (
        <div className="prose prose-sm mt-3 max-w-none rounded-lg bg-secondary/20 p-3 text-sm dark:prose-invert">
          <ReactMarkdown>{aiAdvice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
