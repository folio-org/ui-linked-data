import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { scrollToTop } from '@common/helpers/pageScrolling.helper';
import { Button } from '@components/Button';

type Props = {
  className?: string | string[];
};

export const ScrollToTop: FC<Props> = ({ className }) => (
  <Button onClick={scrollToTop} className={className ? classNames(className) : undefined}>
    <FormattedMessage id="marva.back-to-top" />
  </Button>
);
