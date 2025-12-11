import type { Row } from '@/components/Table';

interface SelectCtlFormatterProps {
  row: Row;
  formatMessage: (descriptor: { id: string }, values?: Record<string, unknown>) => string;
  onToggleSelect: (id: string, checked: boolean) => void;
  selectedInstances: string[];
}

export const InstanceSelectCtlFormatter = ({
  row,
  formatMessage,
  onToggleSelect,
  selectedInstances,
}: SelectCtlFormatterProps) => {
  const rowMeta = row.__meta;
  const typedTitle = row.title.label as string;

  return (
    <div className="row-select-container">
      <input
        id={`row-select-ctl-${rowMeta?.key}`}
        type="checkbox"
        checked={selectedInstances.includes(rowMeta?.id as string)}
        onChange={e => onToggleSelect(rowMeta?.id as string, e.target.checked)}
        aria-label={formatMessage({ id: 'ld.aria.table.selectRow' }, { title: typedTitle })}
      />
    </div>
  );
};
