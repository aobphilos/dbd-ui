import { OwnerView } from '../model/views/owner-view';

export function copyDataOnly(source: any) {
  if (!source) { return null; }
  const data = Object.keys(source).reduce<any>((item, key) => {
    if (key !== 'id') {
      if (source[key] instanceof OwnerView) {
        item[key] = { ...source[key] };
      } else {
        item[key] = source[key];
      }
    }
    return item;
  }, {});
  return data;
}
