import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@common/constants/routes.constants';
import { CommonStatus } from '@components/CommonStatus';
import { Nav } from '@components/Nav';
import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { Search } from '../Search';
import { Edit } from '../Edit';
import { Load } from '../Load';
import { Main } from '../Main';

export const Root = () => {
  const componentsMap: Record<string, JSX.Element> = {
    [ROUTES.MAIN.uri]: <Main />,
    [ROUTES.SEARCH.uri]: <Search />,
    [ROUTES.RESOURCE_EDIT.uri]: <Edit />,
    [ROUTES.RESOURCE_CREATE.uri]: <Edit />,
    [ROUTES.DASHBOARD.uri]: <Load />,
  };

  return (
    <>
      <Nav />
      <CommonStatus />
      <div className="main-content">
        <Routes>
          {Object.values(ROUTES).map(({ uri }) => (
            <Route path={uri} element={componentsMap[uri]} key={uri} />
          ))}
        </Routes>
      </div>
      <div id={MODAL_CONTAINER_ID} />
    </>
  );
};
