import { useRecordControls } from '@common/hooks/useRecordControls';
import { ItemSearch } from '@components/ItemSearch';
import './Search.scss';

export const Search = () => {
  const { fetchRecord } = useRecordControls();

  return (
    <div className="search" data-testid="search">
      <ItemSearch fetchRecord={fetchRecord} />
    </div>
  );
};
