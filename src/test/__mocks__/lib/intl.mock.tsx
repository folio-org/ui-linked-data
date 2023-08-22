import { FC } from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }: { id: string }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ id, children }: any) => {
      if (children) {
        return children([id]);
      }

      return id;
    },
    FormattedTime: ({ value, children }: any) => {
      if (children) {
        return children([value]);
      }

      return value;
    },
    FormattedNumber: ({ value, children }: any) => {
      if (children) {
        return children([value]);
      }

      return value;
    },
    IntlProvider: ({ children, defaultLocale, ...rest }: any) => (
      <div {...rest}>{children}</div>
    ),
    useIntl: () => intl,
    injectIntl: (Component: FC) => (props: any) => <Component {...props} intl={intl} />,
  };
});
