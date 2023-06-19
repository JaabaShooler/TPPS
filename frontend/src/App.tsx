import { configure } from 'axios-hooks';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import Login from './pages/Login/Login.tsx';
import Main from './pages/Main/Main.tsx';
import SignUp from './pages/SignUp/SignUp.tsx';
import { ROUTES } from './constants.ts';
import instance from './instance.ts';

import './App.css';

configure({ axios: instance, cache: false });

const App = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.SIGNUP} element={<SignUp />} />
    <Route element={<ProtectedRoute />}>
      <Route path={ROUTES.MAIN} element={<Main />} />
    </Route>
  </Routes>
);

export default App;
