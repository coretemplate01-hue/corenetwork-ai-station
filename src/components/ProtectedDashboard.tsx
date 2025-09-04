import { useAuth } from "@/contexts/AuthContext";
import DashboardLogin from "@/components/DashboardLogin";
import Dashboard from "@/pages/Dashboard";

const ProtectedDashboard = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <DashboardLogin onLogin={login} />;
  }

  return <Dashboard />;
};

export default ProtectedDashboard;