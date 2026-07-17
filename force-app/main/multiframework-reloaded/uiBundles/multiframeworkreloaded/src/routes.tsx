import type { RouteObject } from 'react-router';
import AppLayout from '@/appLayout';
import Home from './pages/Home';
import Export from './pages/Export';
import Record from './pages/Record';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        handle: { showInNavigation: true, label: 'Home' },
      },
      {
        path: '/export',
        element: <Export />,
        handle: { showInNavigation: true, label: 'Export' },
      },
      {
        path: '/record/:id',
        element: <Record />,
        handle: { showInNavigation: false, label: 'Record' },
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  }
];
