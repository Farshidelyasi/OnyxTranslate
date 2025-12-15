export interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export enum TranslationProvider {
  GOOGLE = 'Google Translate',
  YANDEX = 'Yandex',
  DEEPL = 'DeepL',
  GPT = 'GPT-4 Style'
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  pronunciation?: string; // Transliteration
  alternatives?: string[];
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  provider: TranslationProvider;
  timestamp: number;
}
