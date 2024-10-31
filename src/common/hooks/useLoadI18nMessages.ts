import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { loadI18nMessages } from '@common/helpers/locales.helper';
import { LOCALES } from '@common/i18n/locales';
import baseLocaleMessages from '@translations/ui-linked-data/en.json';
import state from '@state';

export const useLoadI18nMessages = () => {
  const [i18nMessages, setI18nMessages] = useRecoilState(state.config.i18nMessages);

  useEffect(() => {
    async function onLoad() {
      try {
        const messages = await loadI18nMessages(LOCALES);
        setI18nMessages(messages);
      } catch (error) {
        console.error('Messages loading failed', error);
      }
    }

    onLoad();
  }, []);

  return { i18nMessages, baseLocaleMessages };
};
