import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { ButtonGroup } from '@components/ButtonGroup';
import { Button, ButtonType } from '@components/Button';
import { SearchSegment } from '@common/constants/search.constants';
import './SearchSegments.scss';

type SearchSegmentsProps = {
  onChangeSegment?: (value: SearchSegmentValue) => void;
};

const SearchSegments: FC<SearchSegmentsProps> = ({ onChangeSegment }) => {
  const { navigationSegment } = useSearchContext();
  const { value: selectedNavigationSegment, set: setSelectedNavigationSegment } =
    navigationSegment as NavigationSegment;

  const onSegmentClick = (value: SearchSegmentValue) => {
    if (value === selectedNavigationSegment) return;

    setSelectedNavigationSegment(value);
    onChangeSegment?.(value);
  };

  // TODO: create a config to avoid repeating code and use it for rendering these buttons
  return (
    <ButtonGroup className="search-segments" fullWidth>
      <Button
        type={selectedNavigationSegment === SearchSegment.Search ? ButtonType.Highlighted : ButtonType.Primary}
        aria-selected={selectedNavigationSegment === SearchSegment.Search}
        role="tab"
        className="search-segment-button"
        onClick={() => onSegmentClick(SearchSegment.Search)}
        data-testid="id-search-segment-button"
      >
        <FormattedMessage id={'marva.search'} />
      </Button>
      <Button
        type={selectedNavigationSegment === SearchSegment.Browse ? ButtonType.Highlighted : ButtonType.Primary}
        aria-selected={selectedNavigationSegment === SearchSegment.Browse}
        role="tab"
        className="search-segment-button"
        onClick={() => onSegmentClick(SearchSegment.Browse)}
        data-testid="id-search-browse-button"
      >
        <FormattedMessage id={'marva.browse'} />
      </Button>
    </ButtonGroup>
  );
};

export default SearchSegments;
