import React, { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin as checkIsAdmin } from "../api";
import ModalStrip from "../components/ModalStrip";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await checkIsAdmin();
        setIsAdmin(response.is_admin === true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStatus();
  }, []);

  if (loading) {
    return (
      <div>
        <ModalStrip />
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminGuard;
