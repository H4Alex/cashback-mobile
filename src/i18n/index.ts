import ptBR from "./locales/pt-BR";
import en from "./locales/en";

export type TranslationKeys = typeof ptBR;

const translations = { "pt-BR": ptBR, en } as const;

export type Locale = keyof typeof translations;

let currentLocale: Locale = "pt-BR";

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

export function t(key: TranslationKey): string {
  const keys = key.split(".");
  let result: unknown = translations[currentLocale];
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof result === "string" ? result : key;
}
