import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes as Router, Navigate, Outlet, Route } from "react-router-dom";
import LoginPage from "../../features/auth/LoginPage";
import HomePage from "../../features/home/HomePage";
import ErrorPage from "../layout/ErrorPage";

type Props = {};

const PrivateRoutes = () => {
  const { authenticated } = useContext(AuthContext);
  if (!authenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

const Routes = (props: Props) => {
  const { authenticated } = useContext(AuthContext);

  return (
    <Router>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Router>
  );
};

export default Routes;
