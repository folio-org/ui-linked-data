import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Button } from '@components/Button';
import { getByClassNameAndScrollToTop } from '@common/helpers/pageScrolling.helper';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';

type Props = {
  className?: string | string[];
};

const scrollToTop = () => getByClassNameAndScrollToTop(DOM_ELEMENTS.classNames.itemSearchContentContainer);

export const ScrollToTop: FC<Props> = ({ className }) => (
  <Button onClick={scrollToTop} className={className ? classNames(className) : undefined}>
    <FormattedMessage id="marva.backToTop" />
  </Button>
);
