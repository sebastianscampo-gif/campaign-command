import { ScreenStub } from './ScreenStub';

interface PlaceholderScreenProps {
  eyebrow: string;
  title: string;
  lede: string;
}

export function PlaceholderScreen({
  eyebrow,
  title,
  lede,
}: PlaceholderScreenProps) {
  return (
    <ScreenStub
      eyebrow={eyebrow}
      title={title}
      lede={lede}
      rows={[{ label: 'ESTADO', value: 'En hoja de ruta' }]}
    />
  );
}
