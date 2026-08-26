import { HomePage } from '@/components/HomePage';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '../../metadata';

export const metadata = pageMetadata('id', 'home');

export default function Page() {
  return <HomePage dict={getDictionary('id')} locale="id" />;
}
