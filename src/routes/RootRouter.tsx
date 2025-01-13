import RootLayout from "@/layout/RootLayout";
import Dashboard from "@/pages/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";

const RootRouter = () => {
  return (
    <Routes>
      <Route path="/app" element={<RootLayout />}>
        <Route index path="dashboard" element={<Dashboard />} />
        <Route path="historical_data" element={<></>} />
        <Route path="user_management" element={<></>} />
      </Route>
      <Route path="*" element={<Navigate to={"/app/dashboard"} />} />
    </Routes>
  );
};

export default RootRouter;
