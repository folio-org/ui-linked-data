interface ILookupCacheService {
  save: (key: string, data: MultiselectOption[]) => void;
  getAll: () => Record<string, MultiselectOption[]>;
  getById: (id: string) => MultiselectOption[];
}
