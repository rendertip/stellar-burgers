import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { fetchIngredients } from '@slices/ingredients-slice';
import { fetchOrderByNumber } from '@slices/order-slice';
import { fetchUser } from '@slices/user-slice';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { getCookie } from '@utils/cookie';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    void dispatch(fetchIngredients());
    if (getCookie('accessToken')) void dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent isLoading={isLoading} error={error} />
    </div>
  );
};

export default App;

const AppContent = ({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: string | null;
}): React.JSX.Element => {
  const { pathname } = useLocation();

  if (isLoading && pathname === '/') return <Preloader />;

  if (error && pathname === '/') {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  return <RouteComponent />;
};

const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: {
  children: React.JSX.Element;
  onlyUnAuth?: boolean;
}): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (getCookie('accessToken') && !isAuthChecked) return <Preloader />;
  if (!onlyUnAuth && !user)
    return <Navigate to="/login" replace state={{ from: location }} />;
  if (onlyUnAuth && user) return <Navigate to="/" replace />;
  return children;
};

const IngredientRoute = (): React.JSX.Element => (
  <main className="pt-20">
    <IngredientDetails />
  </main>
);

const OrderContent = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (number) void dispatch(fetchOrderByNumber(Number(number)));
  }, [dispatch, number]);

  return <OrderInfo />;
};

const OrderRoute = (): React.JSX.Element => (
  <main className="pt-20">
    <OrderContent />
  </main>
);

const IngredientModalRoute = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Modal title="Детали ингредиента" onClose={() => void navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const OrderModalRoute = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  return (
    <Modal
      title={`#${String(number).padStart(6, '0')}`}
      onClose={() => void navigate(-1)}
    >
      <OrderContent />
    </Modal>
  );
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const background = (location.state as { background?: Location } | null)?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderRoute />} />
        <Route path="/ingredients/:id" element={<IngredientRoute />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderRoute />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModalRoute />} />
          <Route path="/feed/:number" element={<OrderModalRoute />} />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModalRoute />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
