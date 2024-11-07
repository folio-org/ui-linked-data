import { AuthRefType } from '@common/constants/search.constants';

export const AuthorizedFormatter = ({ row }: { row: SearchResultsTableRow }) => {
  const isAuthorized = row.authorized.label === AuthRefType.Authorized;
  const { label } = row.authorized;

  return isAuthorized ? <b>{label}</b> : <span>{label}</span>;
};
