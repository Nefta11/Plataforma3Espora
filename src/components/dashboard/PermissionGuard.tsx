import React, { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../data/roles";

interface PermissionGuardProps {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { user } = useAuth();
  
  if (!user || !hasPermission(user.role, permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};