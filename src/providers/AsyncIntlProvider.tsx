import { FC, useMemo } from 'react';
import { IntlContext, createIntl, createIntlCache } from 'react-intl';

import { DEFAULT_LOCALE } from '@/common/constants/i18n.constants';
import { useLoadI18nMessages } from '@/common/hooks/useLoadI18nMessages';

import { useConfigState } from '@/store';

type AsyncIntlProviderProps = {
  cachedMessages: I18nMessages;
  children: React.ReactNode;
};

export const AsyncIntlProvider: FC<AsyncIntlProviderProps> = ({ cachedMessages, children }) => {
  const { locale } = useConfigState(['locale']);
  const { getMessages } = useLoadI18nMessages(cachedMessages, DEFAULT_LOCALE);

  const i18nMessages = getMessages(locale);

  // React 19 compatible approach
  const intl = useMemo(() => {
    const cache = createIntlCache();
    return createIntl(
      {
        locale,
        messages: i18nMessages || {},
        defaultLocale: DEFAULT_LOCALE,
      },
      cache,
    );
  }, [locale, i18nMessages]);

  return <IntlContext value={intl}>{children}</IntlContext>;
};
