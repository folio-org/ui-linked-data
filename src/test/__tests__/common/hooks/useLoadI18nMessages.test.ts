import { loadI18nMessages } from '@common/helpers/locales.helper';
import { useLoadI18nMessages } from '@common/hooks/useLoadI18nMessages';

jest.mock('@common/helpers/locales.helper');

describe('useLoadI18nMessages', () => {
  const locale = 'en';
  let cachedMessages: I18nMessages;
  let loadMessages: (locale: string) => Promise<void>;

  beforeEach(() => {
    cachedMessages = {};
    loadMessages = useLoadI18nMessages(cachedMessages).loadMessages;
  });

  describe('loadMessages', () => {
    it('calls loadI18nMessages with the correct locale', async () => {
      const messages = { greeting: 'Hello' };
      (loadI18nMessages as jest.Mock).mockResolvedValue(messages);

      await loadMessages(locale);

      expect(loadI18nMessages).toHaveBeenCalledWith(locale);
    });

    it('stores messages in cachedMessages when messages are returned', async () => {
      const messages = { greeting: 'Hello' };
      (loadI18nMessages as jest.Mock).mockResolvedValue(messages);

      await loadMessages(locale);

      expect(cachedMessages[locale]).toEqual(messages);
    });

    it('does not store messages in cachedMessages when no messages are returned', async () => {
      (loadI18nMessages as jest.Mock).mockResolvedValue(null);

      await loadMessages(locale);

      expect(cachedMessages[locale]).toBeUndefined();
    });

    it('handles errors thrown by loadI18nMessages', async () => {
      const error = new Error('Failed to load messages');
      (loadI18nMessages as jest.Mock).mockRejectedValue(error);

      await expect(loadMessages(locale)).rejects.toThrow(error);
    });
  });
});
