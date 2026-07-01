import { authorityRecordSchema } from './authority.schema';
import { hubRecordSchema } from './hub.schema';
import { instanceRecordSchema } from './instance.schema';
import { workRecordSchema } from './work.schema';

export const profileRecordSchemas = {
  instance: instanceRecordSchema,
  work: workRecordSchema,
  hub: hubRecordSchema,
  authority: authorityRecordSchema,
};
