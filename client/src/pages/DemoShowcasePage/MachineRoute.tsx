import { useLayoutEffect, useSyncExternalStore } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cleaningMachineStore } from './cleaning-machine-store';
import { findMachineModel, getMachineModel } from './machine-models';
import { entryPath } from '../../runtime';
import DemoShowcasePage from './DemoShowcasePage';

export default function MachineRoute() {
  const { model: modelId } = useParams();
  const model = findMachineModel(modelId ?? 'bw05s');
  useSyncExternalStore(cleaningMachineStore.subscribe, cleaningMachineStore.getSnapshot);
  useLayoutEffect(() => { if (model) cleaningMachineStore.selectModel(model.id); }, [model]);
  if (!model) return <section role="alert"><h1>未找到该清洗机型号</h1><Link to={entryPath()}>返回设备列表</Link></section>;
  if (getMachineModel().id !== model.id) return null;
  return <DemoShowcasePage key={model.id} />;
}
