import { fetchUserOrders } from '@slices/user-slice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isOrdersLoading } = useSelector((state) => state.user);

  useEffect(() => {
    void dispatch(fetchUserOrders());
    const interval = window.setInterval(() => void dispatch(fetchUserOrders()), 10000);
    return (): void => window.clearInterval(interval);
  }, [dispatch]);

  if (isOrdersLoading && !orders.length) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
