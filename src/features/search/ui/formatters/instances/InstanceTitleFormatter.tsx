import { Button, ButtonType } from '@/components/Button';
import { FullDisplayType } from '@/common/constants/uiElements.constants';
import type { Row } from '@/components/Table';

interface TitleFormatterProps {
  row: Row;
  formatMessage: (descriptor: { id: string }, values?: Record<string, unknown>) => string;
  onPreview: (id: string) => void;
  selectedInstances: string[];
  previewContent: Array<{ id: string }>;
  fullDisplayComponentType?: FullDisplayType;
}

export const InstanceTitleFormatter = ({
  row,
  formatMessage,
  onPreview,
  selectedInstances,
  previewContent,
  fullDisplayComponentType,
}: TitleFormatterProps) => {
  const rowMeta = row.__meta;
  const comparisonIndex = selectedInstances.indexOf(rowMeta?.id as string);
  const typedTitle = row.title.label as string;

  return (
    <div className="title-wrapper">
      {comparisonIndex >= 0 &&
        (previewContent.length > 1 || fullDisplayComponentType === FullDisplayType.Comparison) && (
          <span className="comparison-index">{comparisonIndex + 1}</span>
        )}
      <Button
        type={ButtonType.Link}
        onClick={() => onPreview(rowMeta?.id as string)}
        data-testid={`preview-button__${rowMeta?.id}`}
        ariaLabel={formatMessage({ id: 'ld.aria.sections.openResourcePreview' }, { title: typedTitle })}
      >
        {row.title.label}
      </Button>
    </div>
  );
};
