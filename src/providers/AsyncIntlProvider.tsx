import { FC } from 'react';
import { IntlProvider } from 'react-intl';
import { useLoadI18nMessages } from '@common/hooks/useLoadI18nMessages';
import { DEFAULT_LOCALE } from '@common/constants/i18n.constants';
import { useConfigState } from '@src/store';

type AsyncIntlProviderProps = {
  cachedMessages: I18nMessages;
  children: React.ReactNode;
};

export const AsyncIntlProvider: FC<AsyncIntlProviderProps> = ({ cachedMessages, children }) => {
  const { locale } = useConfigState();
  const { getMessages } = useLoadI18nMessages(cachedMessages, DEFAULT_LOCALE);

  const i18nMessages = getMessages(locale);

  return (
    <IntlProvider messages={i18nMessages || {}} locale={locale} defaultLocale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  );
};
