import { loadI18nMessages } from '@common/helpers/locales.helper';

export const useLoadI18nMessages = (cachedMessages: I18nMessages, defaultLocale = 'en') => {
  const getMessages = (locale: string) => {
    if (cachedMessages?.[locale]) {
      return cachedMessages?.[locale];
    }

    throw loadMessages(locale);
  };

  const loadMessages = async (locale: string) => {
    const messages = await loadI18nMessages(locale);

    if (messages) {
      cachedMessages[locale] = {...cachedMessages[defaultLocale], messages};
    }
  };

  return { getMessages, loadMessages };
};
