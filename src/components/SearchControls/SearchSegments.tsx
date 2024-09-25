import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { ButtonGroup } from '@components/ButtonGroup';
import { Button, ButtonType } from '@components/Button';
import './SearchSegments.scss';

type SearchSegmentsProps = {
  onChangeSegment?: (value: SearchSegmentValue) => void;
};

const SearchSegments: FC<SearchSegmentsProps> = ({ onChangeSegment }) => {
  const { primarySegments, navigationSegment } = useSearchContext();
  const { value: selectedNavigationSegment, set: setSelectedNavigationSegment } =
    navigationSegment as NavigationSegment;

  const onSegmentClick = (value: SearchSegmentValue) => {
    if (value === selectedNavigationSegment) return;

    setSelectedNavigationSegment(value);
    onChangeSegment?.(value);
  };

  return (
    <ButtonGroup className="search-segments" fullWidth>
      {primarySegments &&
        Object.entries(primarySegments)?.map(([type, { labelId }]) => {
          const isSelected = selectedNavigationSegment === type;

          return (
            <Button
              type={isSelected ? ButtonType.Highlighted : ButtonType.Primary}
              aria-selected={isSelected}
              role="tab"
              className="search-segment-button"
              onClick={() => onSegmentClick(type as SearchSegmentValue)}
              data-testid="id-search-segment-button"
            >
              <FormattedMessage id={labelId} />
            </Button>
          );
        })}
    </ButtonGroup>
  );
};

export default SearchSegments;
