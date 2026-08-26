import { LegalPage } from '@/components/LegalPage';
import { getDictionary, getLegal } from '@/i18n';
import { pageMetadata } from '../../metadata';

export const metadata = pageMetadata('en', 'privacy');

export default function Page() {
  return <LegalPage doc={getLegal('en').privacy} dict={getDictionary('en')} locale="en" />;
}
