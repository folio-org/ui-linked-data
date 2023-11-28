import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import state from '@state';
import { Properties } from '@src/components/Properties';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('Properties', () => {
  const initialSchemaKey = 'test_0';

  const renderComponent = (schema: Map<string, any>, initialSchemaKey: string | null) =>
    render(
      <RecoilRoot
        initializeState={snapshot => {
          snapshot.set(state.config.schema, schema);
          snapshot.set(state.config.initialSchemaKey, initialSchemaKey);
        }}
      >
        <Properties />
      </RecoilRoot>,
    );

  test('render Properties component', () => {
    const schema = new Map([['test_0', {}]]);

    const { container } = renderComponent(schema, initialSchemaKey);

    expect(container.firstChild).toHaveClass('properties');
  });

  test('render Properties with a "strong" element', () => {
    const schema = new Map([
      [
        'test_0',
        {
          displayName: 'test name 1',
          type: AdvancedFieldType.block,
          uuid: 'testUuid_1',
        },
      ],
    ]);

    const { container } = renderComponent(schema, initialSchemaKey);

    expect(container.getElementsByTagName('strong')).toHaveLength(1);
  });

  describe('render "group" type', () => {
    const schema = new Map([
      [
        'test_0',
        {
          displayName: 'test name 1',
          type: AdvancedFieldType.group,
          uuid: 'testUuid_1',
        },
      ],
    ]);

    test('render Properties with one "properties-button" element', () => {
      renderComponent(schema, initialSchemaKey);

      expect(screen.getAllByTestId('properties-button')).toHaveLength(1);
    });

    test('click on the rendered "properties-button" element', () => {
      const scrollIntoViewMock = jest.fn();
      window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

      renderComponent(schema, initialSchemaKey);
      fireEvent.click(screen.getByTestId('properties-button'));

      waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });
  });
});
