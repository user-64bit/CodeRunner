export function getLanguageId(language: string): number {
  const languageMap: { [key: string]: number } = {
    "cpp": 105,
    "java": 91,
    "javascript": 102,
    "python3": 100,
    "rust": 73,
  };
  return languageMap[language.toLowerCase()];
}