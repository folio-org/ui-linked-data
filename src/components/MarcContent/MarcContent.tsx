import { ComponentPropsWithoutRef, FC } from 'react';

import { MarcField } from '@/components/MarcField';

type MarcContentProps = ComponentPropsWithoutRef<'section'> & {
  marc: MarcDTO;
};

export const MarcContent: FC<MarcContentProps> = ({ marc, ...rest }) => {
  const parsedContent = marc?.parsedRecord?.content;

  return (
    <section {...rest}>
      <table>
        <tbody>
          <tr>
            <td colSpan={4}>{`LEADER ${parsedContent?.leader}`}</td>
          </tr>
          {parsedContent?.fields?.map(field => (
            <MarcField field={field} key={Object.keys(field)[0]} />
          ))}
        </tbody>
      </table>
    </section>
  );
};
