import { RootShell } from '../RootShell';

export { sharedViewport as viewport } from '../metadata';

export default function IndonesianLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell locale="id">
      {children}
    </RootShell>
  );
}
