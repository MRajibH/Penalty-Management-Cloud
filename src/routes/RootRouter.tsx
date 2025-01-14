import { useAuthContext } from "@/context/authContext";
import RootLayout from "@/layout/RootLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import PenaltyData from "@/pages/PenaltyData";
import Settings from "@/pages/Settings";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const RootRouter = () => {
  return (
    <Routes>
      <Route path="/app" element={<RootLayout />}>
        <Route index path="dashboard" element={<Dashboard />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="penalty_data" element={<PenaltyData />} />
          <Route path="user_management" element={<></>} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route element={<UnAuthRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={"/app/dashboard"} replace={true} />}
      />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuthContext();
  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} replace={true} />;
};

const UnAuthRoutes = () => {
  const { isLoggedIn } = useAuthContext();
  return isLoggedIn ? (
    <Navigate to={"/app/dashboard"} replace={true} />
  ) : (
    <Outlet />
  );
};

export default RootRouter;
