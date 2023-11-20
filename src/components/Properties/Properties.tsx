import { useRecoilValue } from 'recoil';
import { GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import state from '@state';
import { Fields, IDrawComponent } from '../Fields';
import './Properties.scss';
import { FormattedMessage } from 'react-intl';
import { scrollElementIntoView } from '@common/helpers/pageScrolling.helper';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';

export const Properties = () => {
  const schema = useRecoilValue(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);

  if (!schema.size) {
    return null;
  }

  const drawComponent = ({ entry: { displayName, type, uuid }, level = 0 }: IDrawComponent) => {
    if (level <= GROUP_BY_LEVEL && type !== AdvancedFieldType.profile) {
      if (type === AdvancedFieldType.block) {
        return <strong>{displayName}</strong>;
      } else {
        return (
          <div
            onClick={() =>
              scrollElementIntoView(
                document.querySelector(`[data-scroll-id="${uuid}"]`),
                document.querySelector(`.${DOM_ELEMENTS.classNames.nav}`),
              )
            }
            data-testid="properties-button"
          >
            {displayName}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="properties">
      <h3>
        <FormattedMessage id="marva.properties" />
      </h3>
      <Fields schema={schema} uuid={initialSchemaKey} drawComponent={drawComponent} groupClassName="group" />
    </div>
  );
};
