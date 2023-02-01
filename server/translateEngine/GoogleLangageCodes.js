const languages = [
  { languageName: 'English (US)', languageCode: 'en-US' },
  { languageName: 'French', languageCode: 'fr-FR' },
  { languageName: 'German', languageCode: 'de-DE' },
  { languageName: 'Hindi', languageCode: 'hi-IN' },
  { languageName: 'Italian', languageCode: 'it-IT' },
  { languageName: 'Portuguese (Brazil)', languageCode: 'pt-BR' },
  { languageName: 'Portuguese (Portugal)', languageCode: 'pt-PT' },
  { languageName: 'Russian', languageCode: 'ru-RU' },
  { languageName: 'Spanish (Mexico)', languageCode: 'es-MX' },
  { languageName: 'Spanish (Spain)', languageCode: 'es-ES' },
  { languageName: 'Thai', languageCode: 'th-TH' },
];

const ConvertLanguageNameToCode = (languageName) => {
  const result = languages.filter((obj) => obj.languageName === languageName);
  return result[0].languageCode;
};

module.exports = {
  languages, 
  ConvertLanguageNameToCode
}
