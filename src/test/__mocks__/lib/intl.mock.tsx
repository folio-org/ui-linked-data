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
        const valueArray = Object.values(values);
        const reactElements = valueArray.filter(
          (value): value is object => value !== null && typeof value === 'object' && '$$typeof' in (value as object),
        );

        if (reactElements.length === 0) return id;

        return reactElements.map((value: any, key) => ({ ...value, key }));
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
