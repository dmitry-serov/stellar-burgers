import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  // Пока не проверили авторизацию — показываем загрузку
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Для страниц только для неавторизованных (login, register и т.д.)
  if (onlyUnAuth && isAuthenticated) {
    // Редирект на предыдущую страницу или на главную
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  // Для защищённых страниц (profile, orders и т.д.)
  if (!onlyUnAuth && !isAuthenticated) {
    // Редирект на login с сохранением текущего пути
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
