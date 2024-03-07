import * as uuid from 'uuid';
import * as BibframeConstants from '@common/constants/bibframe.constants';
import { ISelectedEntries } from '@common/services/selectedEntries/selectedEntries.interface';
import { SchemaService } from '@common/services/schema';
import { templatesData } from './data/templates.data';
import { profileData } from './data/profile.data';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { generatedSchema } from './data/generatedSchema.data';

jest.mock('uuid');

describe('SchemaService', () => {
  class SelectedEntriesService {
    get() {}
    addNew() {}
    addDuplicated() {}
    remove() {}
  }

  const mockedResourceTemplateIds = getMockedImportedConstant(BibframeConstants, 'RESOURCE_TEMPLATE_IDS');
  mockedResourceTemplateIds({
    instanceId: 'Instance',
  });

  test('generates a basic schema with the required fields', () => {
    jest
      .spyOn(uuid, 'v4')
      .mockReturnValueOnce('testKey-2')
      .mockReturnValueOnce('testKey-3')
      .mockReturnValueOnce('testKey-4')
      .mockReturnValueOnce('testKey-5')
      .mockReturnValueOnce('testKey-6')
      .mockReturnValueOnce('testKey-7')
      .mockReturnValueOnce('testKey-8')
      .mockReturnValueOnce('testKey-9')
      .mockReturnValueOnce('testKey-10')
      .mockReturnValueOnce('testKey-11')
      .mockReturnValueOnce('testKey-12')
      .mockReturnValueOnce('testKey-13')
      .mockReturnValueOnce('testKey-14')
      .mockReturnValueOnce('testKey-15')
      .mockReturnValueOnce('testKey-16')
      .mockReturnValueOnce('testKey-17')
      .mockReturnValueOnce('testKey-18');

    const initKey = 'testKey-1';

    const schemaService = new SchemaService(
      templatesData as unknown as ResourceTemplates,
      profileData as unknown as ProfileEntry,
      new SelectedEntriesService() as unknown as ISelectedEntries,
    );

    const schema = schemaService.generate(initKey);

    expect(schema).toEqual(generatedSchema);
  });
});
