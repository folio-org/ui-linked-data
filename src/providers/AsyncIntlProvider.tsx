import { FC } from 'react';
import { IntlProvider } from 'react-intl';
import { useRecoilValue } from 'recoil';
import { useLoadI18nMessages } from '@common/hooks/useLoadI18nMessages';
import state from '@state';

type AsyncIntlProviderProps = {
  cachedMessages: I18nMessages;
  children: React.ReactNode;
};

const DEFAULT_LOCALE = 'en';

export const AsyncIntlProvider: FC<AsyncIntlProviderProps> = ({ cachedMessages, children }) => {
  const locale = useRecoilValue(state.config.locale);
  const { getMessages } = useLoadI18nMessages(cachedMessages, DEFAULT_LOCALE);

  const i18nMessages = getMessages(locale);

  return (
    <IntlProvider messages={i18nMessages || {}} locale={locale} defaultLocale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  );
};
