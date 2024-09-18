import { ButtonGroup } from '@components/ButtonGroup';
import { Button, ButtonType } from '@components/Button';
import { SearchContext } from '@src/contexts';
import { FC, useContext } from 'react';

interface SearchSegmentsProps {}

const SearchSegments: FC<SearchSegmentsProps> = () => {
  const { navigationSegment } = useContext(SearchContext);
  const { value: selectedNavigationSegment, set: setSelectedNavigationSegment } =
    navigationSegment as NavigationSegment;

  return (
    <ButtonGroup fullWidth>
      <Button
        type={selectedNavigationSegment === 'id-search-segment-button' ? ButtonType.Highlighted : ButtonType.Primary}
        aria-selected={true}
        role="tab"
        className="search-button"
        onClick={() => setSelectedNavigationSegment('id-search-segment-button')}
        data-testid="id-search-segment-button"
      >
        Search
      </Button>
      <Button
        type={selectedNavigationSegment === 'id-search-browse-button' ? ButtonType.Highlighted : ButtonType.Primary}
        aria-selected={false}
        role="tab"
        className="search-button"
        onClick={() => setSelectedNavigationSegment('id-search-browse-button')}
        data-testid="id-search-browse-button"
      >
        Browse
      </Button>
    </ButtonGroup>
  );
};

export default SearchSegments;
