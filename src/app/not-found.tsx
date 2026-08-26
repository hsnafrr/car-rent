import { RootShell } from './RootShell';
import { NotFoundContent } from '@/components/NotFoundContent';

/**
 * Root 404.
 *
 * With two root layouts, one per language route group, Next renders this file
 * without any layout at all. It therefore has to produce the whole document
 * itself, which it does by reusing the same shell the real pages use, so the
 * 404 keeps the header, footer, theme, and fonts instead of falling back to the
 * unstyled framework default.
 */
export default function NotFound() {
  return (
    <RootShell locale="en">
      <NotFoundContent />
    </RootShell>
  );
}
