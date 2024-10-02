interface ReactSelectOption {
  label: string;
  value: string;
  uri: string;
  id?: string;
}

interface ReactMultiselectOption {
  label: string;
  __isNew__: boolean;
}

interface MultiselectOption {
  label: string;
  subLabel?: string;
  __isNew__: boolean;
  value: {
    id?: string;
    label?: string;
    uri?: Nullable<string>;
  };
}

type FilterLookupOption = {
  label: string;
  subLabel?: string;
  value: {
    id: string;
  };
};

type Limiters = Record<
  SearchLimiterNames | SearchLimiterNamesAuthority,
  any[] | Suppressed | PublishDate | AuthorityType | SourceType
>;
