import { useAuth } from "@/contexts/AuthContext";
import DashboardLogin from "@/components/DashboardLogin";
import PresentationManager from "@/pages/PresentationManager";

const ProtectedPresentationManager = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <DashboardLogin onLogin={login} />;
  }

  return <PresentationManager />;
};

export default ProtectedPresentationManager;