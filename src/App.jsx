import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { RootLayout } from '@/layouts';
import { Diary, SchoolNotes } from '@/pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Diary />} />
      <Route path='school-notes' element={<SchoolNotes />} />
          </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
