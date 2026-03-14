import { createBrowserRouter } from 'react-router';
import YesLinksProvider from './components/yes-links-provider';
import ActiveLinks from './pages/active-links';
import GlobalStats from './pages/global-stats';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: YesLinksProvider,
    children: [
      {
        index: true,
        Component: ActiveLinks,
      },
      {
        path: 'stats',
        Component: GlobalStats,
      },
    ],
  },
]);