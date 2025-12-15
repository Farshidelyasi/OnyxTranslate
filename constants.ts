import { Language, TranslationProvider } from './types';
import { Globe, Zap, Box, Layers } from 'lucide-react';

export const LANGUAGES: Language[] = [
  { code: 'auto', name: 'Detect Language', nativeName: 'تشخیص زبان', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
];

export const PROVIDERS = [
  { id: TranslationProvider.GOOGLE, name: 'Google', icon: Globe, color: 'text-blue-500' },
  { id: TranslationProvider.YANDEX, name: 'Yandex', icon: Layers, color: 'text-red-500' },
  { id: TranslationProvider.DEEPL, name: 'DeepL', icon: Box, color: 'text-indigo-400' },
  { id: TranslationProvider.GPT, name: 'AI Precise', icon: Zap, color: 'text-emerald-400' },
];