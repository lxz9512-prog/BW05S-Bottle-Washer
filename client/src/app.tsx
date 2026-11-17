import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import NotFound from './pages/NotFound/NotFound';
import DeviceList from './pages/DeviceList/DeviceList';
import DemoShowcasePage from './pages/DemoShowcasePage/DemoShowcasePage';
import NotificationsDemoPage from './pages/NotificationsDemoPage/NotificationsDemoPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DeviceList />} />
        <Route path="cleaning-machine" element={<DemoShowcasePage />} />
        <Route path="notifications" element={<NotificationsDemoPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
