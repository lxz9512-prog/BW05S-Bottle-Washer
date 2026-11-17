import HomeScreen from './HomeScreen';
import type { ComponentProps } from 'react';

export default function CustomModeScreen(props: ComponentProps<typeof HomeScreen>) {
  return <HomeScreen {...props} initialCustom />;
}
