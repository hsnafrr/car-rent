import { LegalPage } from '@/components/LegalPage';
import { getDictionary, getLegal } from '@/i18n';
import { pageMetadata } from '../../../metadata';

export const metadata = pageMetadata('id', 'privacy');

export default function Page() {
  return <LegalPage doc={getLegal('id').privacy} dict={getDictionary('id')} locale="id" />;
}
