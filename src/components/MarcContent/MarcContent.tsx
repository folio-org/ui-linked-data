import { FC } from 'react';

import { MarcField } from '@/components/MarcField';

type MarcContent = {
  marc: MarcDTO;
  [x: string]: any;
};

export const MarcContent: FC<MarcContent> = ({ marc, ...rest }) => {
  const parsedContent = marc?.parsedRecord?.content;

  return (
    <section tabIndex={0} {...rest}>
      {/* NOSONAR */}
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
