import { useRecordControls } from '@common/hooks/useRecordControls';
import { ItemSearch } from '@components/ItemSearch';

export const Search = () => {
  const { fetchRecord } = useRecordControls();

  return (
    <div data-testid="search">
      <ItemSearch fetchRecord={fetchRecord} />
    </div>
  );
};
