export const loadI18nMessages = async (locale: string) => {
  let loadedMessages;

  try {
    loadedMessages = (await import(`../../../translations/ui-linked-data/${locale.replace('-', '_')}.json`)).default;
  } catch {
    try {
      loadedMessages = (await import(`../../../translations/ui-linked-data/${locale.split('-')[0]}.json`)).default;
    } catch (error) {
      console.error('Error occured while loading i18n messages', error);
    }
  }

  return loadedMessages;
};
