import { LegalPage } from '@/components/LegalPage';
import { getDictionary, getLegal } from '@/i18n';
import { pageMetadata } from '../../metadata';

export const metadata = pageMetadata('en', 'terms');

export default function Page() {
  return <LegalPage doc={getLegal('en').terms} dict={getDictionary('en')} locale="en" />;
}
