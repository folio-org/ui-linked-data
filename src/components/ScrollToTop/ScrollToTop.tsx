import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { scrollToTop } from '@common/helpers/pageScrolling.helper';
import classNames from 'classnames';

type Props = {
  className?: string | string[];
};

export const ScrollToTop: FC<Props> = ({ className }) => (
  <button onClick={scrollToTop} className={className ? classNames(className) : undefined}>
    <FormattedMessage id="marva.back-to-top" />
  </button>
);
