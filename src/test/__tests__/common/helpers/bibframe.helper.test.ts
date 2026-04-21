import { RecordEditActions } from '@/common/constants/record.constants';
import { QueryParams, ROUTES } from '@/common/constants/routes.constants';
import * as BibframeHelper from '@/common/helpers/bibframe.helper';

describe('bibframe.helper', () => {
  describe('getEditActionPrefix', () => {
    it('returns RecordEditActions.New when route is RESOURCE_CREATE and no CloneOf query param is present', () => {
      const route = ROUTES.RESOURCE_CREATE.uri;
      const search = new URLSearchParams();

      const result = BibframeHelper.getEditActionPrefix(route, search);

      expect(result).toBe(RecordEditActions.New);
    });

    it('returns RecordEditActions.Duplicate when route is RESOURCE_CREATE and CloneOf query param is present', () => {
      const route = ROUTES.RESOURCE_CREATE.uri;
      const search = new URLSearchParams();
      search.set(QueryParams.CloneOf, 'some-resource-id');

      const result = BibframeHelper.getEditActionPrefix(route, search);

      expect(result).toBe(RecordEditActions.Duplicate);
    });

    it('returns RecordEditActions.Edit when route is not RESOURCE_CREATE', () => {
      const route = ROUTES.RESOURCE_EDIT.uri;
      const search = new URLSearchParams();

      const result = BibframeHelper.getEditActionPrefix(route, search);

      expect(result).toBe(RecordEditActions.Edit);
    });

    it('returns RecordEditActions.Edit when route is undefined', () => {
      const route = undefined;
      const search = new URLSearchParams();

      const result = BibframeHelper.getEditActionPrefix(route, search);

      expect(result).toBe(RecordEditActions.Edit);
    });

    it('returns RecordEditActions.New when search params are undefined', () => {
      const route = ROUTES.RESOURCE_CREATE.uri;
      const search = undefined;

      const result = BibframeHelper.getEditActionPrefix(route, search);

      expect(result).toBe(RecordEditActions.New);
    });
  });
});
