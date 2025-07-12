import { pipeline, type TextClassificationPipeline } from '@huggingface/transformers';

// Define the expected shape of a single sentiment analysis result to guide TypeScript
interface SentimentResult {
  label: string;
  score: number;
}

class SentimentPipeline {
  static readonly task = 'sentiment-analysis';
  static model = 'nlptown/bert-base-multilingual-uncased-sentiment';
  static instance: TextClassificationPipeline | null = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model);
    }
    return this.instance;
  }
}

export const analyzeSentiment = async (text: string): Promise<'positive' | 'negative' | 'neutral'> => {
    if (!text.trim()) {
        return 'neutral';
    }
    
    try {
        const analyzer = await SentimentPipeline.getInstance();
        if (!analyzer) {
          console.error("Sentiment analyzer instance is not available.");
          return 'neutral';
        }

        // The pipeline's return type is complex. We use `any` as a workaround
        // and then immediately handle the expected structure.
        const result: any = await analyzer(text);

        // Normalize the result to always be an array of SentimentResult.
        const resultsArray: SentimentResult[] = Array.isArray(result) ? result : [result];
        
        const firstResult = resultsArray[0];
        
        if (!firstResult) {
            console.error("Sentiment analysis returned no result.");
            return 'neutral';
        }

        // Now, TypeScript knows `firstResult` is a SentimentResult, so we can safely access `label`.
        const { label } = firstResult;
        const stars = parseInt(label.split(' ')[0]);

        if (stars >= 4) return 'positive';
        if (stars <= 2) return 'negative';
        return 'neutral';

    } catch (error) {
        console.error("Sentiment analysis failed:", error);
        // Fallback for when the model fails
        return 'neutral';
    }
};
