import * as schemaHelper from '@/common/helpers/schema.helper';
import { EntryPropertiesGeneratorService } from '@/common/services/schema/entryPropertiesGenerator.service';

describe('EntryPropertiesGeneratorService', () => {
  test('applies htmlId to entry', () => {
    jest.spyOn(schemaHelper, 'getHtmlIdForEntry').mockImplementation(() => mockUuid);

    const mockUuid = 'mockUuid';
    const mockSchema = new Map([[mockUuid, {} as SchemaEntry]]);
    const service = new EntryPropertiesGeneratorService();

    service.addEntryWithHtmlId(mockUuid);
    service.applyHtmlIdToEntries(mockSchema);

    expect(mockSchema.get(mockUuid)?.htmlId).toEqual(mockUuid);
  });
});
