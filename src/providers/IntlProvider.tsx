import { FC } from 'react';
import { IntlProvider } from 'react-intl';
import { useRecoilValue } from 'recoil';
import { useLocale } from '@common/hooks/useLoadI18nMessages';
import state from '@state';

type AsyncIntlProviderProps = {
  cachedMessages: Record<string, Record<string, string>>;
  children: React.ReactNode;
};

export const AsyncIntlProvider: FC<AsyncIntlProviderProps> = ({ cachedMessages, children }) => {
  const locale = useRecoilValue(state.config.locale);
  const { getMessages } = useLocale(cachedMessages);

  const i18nMessages = getMessages(locale);

  return (
    <IntlProvider messages={i18nMessages || {}} locale={locale} defaultLocale="en-US">
      {children}
    </IntlProvider>
  );
};
