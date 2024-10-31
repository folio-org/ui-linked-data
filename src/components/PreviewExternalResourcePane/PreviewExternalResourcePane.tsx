import { useNavigate } from 'react-router-dom';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import { useRecoilValue } from 'recoil';
import state from '@state';
import { getRecordTitle } from '@common/helpers/record.helper';

export const PreviewExternalResourcePane = () => {
  const navigate = useNavigate();
  const record = useRecoilValue(state.inputs.record);

  return (
    <div className="nav-block nav-block-fixed-height">
      <nav>
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={() => navigate(-1)}
          className="nav-close"
        >
          <Times16 />
        </Button>
      </nav>
      <div className="heading">
        {record && getRecordTitle(record)}
      </div>
      <span className="empty-block" />
    </div>
  );
};
