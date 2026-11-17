import RunControlScreen from './RunControlScreen';
import type { ComponentProps } from 'react';

export default function SmartModeScreen(props: Omit<ComponentProps<typeof RunControlScreen>, 'selectedMode'>) {
  return <RunControlScreen {...props} selectedMode="smart" />;
}
