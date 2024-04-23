import { MarcField } from '@components/MarcField';
import { FC } from 'react';

type MarcContent = {
  marc: MarcDTO;
  [x: string]: any;
};

export const MarcContent: FC<MarcContent> = ({ marc, ...rest }) => {
  const parsedContent = marc?.parsedRecord?.content;

  return (
    <section {...rest}>
      <table>
        <tbody>
          <tr>
            <td colSpan={4}>{`LEADER ${parsedContent?.leader}`}</td>
          </tr>
          {parsedContent?.fields?.map((field, idx) => <MarcField field={field} key={idx} />)}
        </tbody>
      </table>
    </section>
  );
};
