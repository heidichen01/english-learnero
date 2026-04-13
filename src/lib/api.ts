const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface TranscriptLine {
  text: string;
  offset: number;
  duration: number;
}

export interface TranscriptResult {
  success: boolean;
  lines?: TranscriptLine[];
  fallbackRequired?: boolean;
}

export interface CambridgeResult {
  word: string;
  partOfSpeech: string | null;
  ukPhonetic: string | null;
  usPhonetic: string | null;
  chineseDefinition: string | null;
  englishDefinition: string | null;
  examples: string[];
  cambridgeUrl: string;
  found: boolean;
}

export async function fetchTranscript(videoId: string): Promise<TranscriptResult> {
  const res = await fetch(`${BASE}/api/transcript?videoId=${encodeURIComponent(videoId)}`);
  return res.json();
}

export async function cambridgeLookup(word: string): Promise<CambridgeResult> {
  const res = await fetch(`${BASE}/api/cambridge?word=${encodeURIComponent(word)}`);
  if (!res.ok) {
    const slug = word.toLowerCase().replace(/\s+/g, "-");
    return {
      word,
      partOfSpeech: null,
      ukPhonetic: null,
      usPhonetic: null,
      chineseDefinition: null,
      englishDefinition: null,
      examples: [],
      cambridgeUrl: `https://dictionary.cambridge.org/zht/dictionary/english-chinese-traditional/${encodeURIComponent(slug)}`,
      found: false,
    };
  }
  return res.json();
}
