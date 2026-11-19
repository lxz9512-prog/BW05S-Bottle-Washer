import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { entryBase, isApp } from './runtime';
import NotFound from './pages/NotFound/NotFound';
import DeviceList from './pages/DeviceList/DeviceList';
import MachineRoute from './pages/DemoShowcasePage/MachineRoute';
import NotificationsDemoPage from './pages/NotificationsDemoPage/NotificationsDemoPage';

const ExperienceLayout = isApp ? lazy(() => import('./components/MobileLayout')) : lazy(() => import('./components/Layout'));

const RoutesComponent = () => {
  return (
    <Suspense fallback={<main role="status" aria-label="Loading" />}><Routes>
      <Route path={entryBase || '/'} element={<ExperienceLayout />}>
        <Route index element={<DeviceList />} />
        <Route path="cleaning-machine/models/:model/:screen?" element={<MachineRoute />} />
        <Route path="cleaning-machine/:screen?" element={<MachineRoute />} />
        {!isApp && <Route path="notifications" element={<NotificationsDemoPage />} />}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes></Suspense>
  );
};

export default RoutesComponent;
