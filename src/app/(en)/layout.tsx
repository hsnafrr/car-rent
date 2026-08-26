import { RootShell } from '../RootShell';

export { sharedViewport as viewport } from '../metadata';

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell locale="en">
      {children}
    </RootShell>
  );
}
