import { nanoid } from 'nanoid';
import slugify from 'slugify';

export const genSlug = (input: string) =>
  slugify(`${input}-${nanoid(8)}`, {
    replacement: '-',
    remove: undefined,
    lower: false,
    strict: false,
    locale: 'vi',
  });
