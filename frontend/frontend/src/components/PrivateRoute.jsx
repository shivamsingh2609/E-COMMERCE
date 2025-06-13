
// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const PrivateRoute = ({ children }) => {
  const userInfo = useStore((state) => state.userInfo);
  return userInfo ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
