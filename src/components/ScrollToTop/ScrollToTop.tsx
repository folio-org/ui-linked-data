import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { scrollToTop } from '@common/helpers/pageScrolling.helper';

type Props = {
  className?: string | string[];
};

export const ScrollToTop: FC<Props> = ({ className }) => (
  <button onClick={scrollToTop} className={className ? classNames(className) : undefined}>
    <FormattedMessage id="marva.back-to-top" />
  </button>
);
