import smart from '../../assets/mode-icons/smart.png';
import normal from '../../assets/mode-icons/auto.png';
import rapid from '../../assets/mode-icons/rapid.png';
import selfClean from '../../assets/mode-icons/self-clean.png';
import breastParts from '../../assets/mode-icons/baby.png';
import soother from '../../assets/mode-icons/bottles.png';
import babyDish from '../../assets/mode-icons/food-bowl.png';
import careProducts from '../../assets/mode-icons/delicate-wash.png';
import custom from '../../assets/mode-icons/custom.png';
import { Wind, Droplets } from 'lucide-react';

const icons: Record<string, string> = {
  smart, auto: normal, rapid, 'self-clean': selfClean, baby: breastParts,
  bottles: soother, 'food-bowl': babyDish, 'delicate-wash': careProducts, custom,
};

export function ModeIcon({ mode }: { mode: string }) {
  if (mode === 'intensive') return <Droplets className="bw-mode-icon bw-vector-icon" aria-hidden="true" />;
  if (mode === 'sterilize-dry') return <Wind className="bw-mode-icon bw-vector-icon" aria-hidden="true" />;
  return <img aria-hidden="true" className="bw-mode-icon" src={icons[mode] ?? custom} alt="" />;
}
