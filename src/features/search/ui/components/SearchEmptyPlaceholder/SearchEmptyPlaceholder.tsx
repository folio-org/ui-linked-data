import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import GeneralSearch from '@/assets/general-search.svg?react';

import './SearchEmptyPlaceholder.scss';

type SearchEmptyPlaceholderProps = {
  labelId?: string;
  className?: string;
};

export const SearchEmptyPlaceholder: FC<SearchEmptyPlaceholderProps> = ({ labelId = '', className }) => (
  <div className={classNames(['empty-placeholder', className])}>
    <GeneralSearch />
    <FormattedMessage id={labelId} />
  </div>
);
