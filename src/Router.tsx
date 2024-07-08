import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ListPage } from './pages/Home.page';
import { QueryClient, QueryClientProvider } from 'react-query';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ListPage />,
  },
]);

const queryClient = new QueryClient()

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}
