import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Preview } from '@components/Preview';
import { Button, ButtonType } from '@components/Button';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import state from '@state';
import { useParams, useSearchParams } from 'react-router-dom';
import { QueryParams, RESOURCE_CREATE_URLS, ROUTES } from '@common/constants/routes.constants';
import { ResourceType } from '@common/constants/record.constants';
import { InstancesList } from '@components/InstancesList';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { checkIfRecordHasDependencies } from '@common/helpers/record.helper';
import { useStoreSelector } from '@common/hooks/useStoreSelectors';
import './EditPreview.scss';

export const EditPreview = () => {
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const { isEditedRecord: isEdited } = useStoreSelector().status;
  const record = useRecoilValue(state.inputs.record);
  const isPositionedSecond =
    currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && currentlyPreviewedEntityBfid.values.length <= 1;
  const { resourceId } = useParams();
  const isCreatePageOpen = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const [queryParams] = useSearchParams();
  const typeParam = queryParams.get(QueryParams.Type);
  const isCreateWorkPageOpened = isCreatePageOpen && typeParam === ResourceType.work;
  const recordHasDependencies = checkIfRecordHasDependencies(record as RecordEntry);
  const showPreview = recordHasDependencies && !isCreateWorkPageOpened;
  const { navigateToEditPage } = useNavigateToEditPage();

  return (
    <div
      className={classNames('preview-container', {
        'positioned-second': isPositionedSecond,
      })}
    >
      {currentlyPreviewedEntityBfid.has(PROFILE_BFIDS.INSTANCE) && (
        <div className="preview-container-header">
          {!recordHasDependencies && (
            <Button
              data-testid="create-instance-button"
              type={ButtonType.Highlighted}
              onClick={() =>
                navigateToEditPage(
                  `${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${resourceId ?? ''}`,
                )
              }
              disabled={!record || isEdited || Boolean(queryParams.get(QueryParams.CloneOf))}
            >
              <FormattedMessage id="ld.addInstance" />
            </Button>
          )}
        </div>
      )}
      {showPreview ? <Preview headless /> : <InstancesList />}
    </div>
  );
};
