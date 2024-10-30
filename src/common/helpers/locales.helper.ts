export const loadI18nMessages = async (localesList: Record<string, string>) => {
  const supportedLocales = Object.values(localesList);
  const messages = {} as I18nMessages;

  for await (const locale of supportedLocales) {
    try {
      const result = await fetch(`/translations/ui-linked-data/${locale}.json`);

      if (result.ok) {
        const parsedMessages = await result.json();

        messages[locale] = parsedMessages;
      }
    } catch (error) {
      console.error('Error occured while loading i18n messages', error);
    }
  }

  return messages;
};
