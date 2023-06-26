import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useConfig from '../../common/hooks/useConfig.hook';
import { EditSection } from '../../components/EditSection/EditSection';
import { Preview } from '../../components/Preview/Preview';
import { Properties } from '../../components/Properties/Properties';
import state from '../../state/state';
import './Edit.scss';

export const Edit = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);

  const { getProfiles } = useConfig();

  return selectedProfile ? (
    <div className="edit-page">
      <Properties />
      <EditSection />
      <Preview />
    </div>
  ) : (
    <div>
      <Link to="/load">Select a record for editing</Link> or{' '}
      <Link to="#" onClick={() => getProfiles()}>
        Start from scratch
      </Link>
    </div>
  );
};
