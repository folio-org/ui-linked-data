import { FC } from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }: { id: string }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ id, children, values }: any) => {
      if (children) {
        return children([id]);
      }

      if (values) {
        return (Object.values(values) as [FC]).map((v: FC, key) => ({ ...v, key }));
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
    FormattedDate: ({ value, day, month, year }: any) => {
      if (day && month && year) {
        return `${day}-${month}-${year}`;
      }

      return value;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    IntlProvider: ({ children, defaultLocale, ...rest }: any) => <div {...rest}>{children}</div>,
    useIntl: () => intl,
    injectIntl: (Component: FC) => (props: any) => <Component {...props} intl={intl} />,
  };
});
