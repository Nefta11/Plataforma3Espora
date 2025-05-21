import React from "react";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../data/roles";
import { PermissionGuard } from "./PermissionGuard";
import { ClientManagement } from "./panels/ClientManagement";
import { UserManagement } from "./panels/UserManagement";
import { SystemConfig } from "./panels/SystemConfig";
import { Analytics } from "./panels/Analytics";

export const FunctionalityPanel: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      <PermissionGuard permission="view-clients">
        <ClientManagement 
          canCreate={hasPermission(user.role, "create-client")}
          canEdit={hasPermission(user.role, "edit-client")}
          canDelete={hasPermission(user.role, "delete-client")}
        />
      </PermissionGuard>
      
      <PermissionGuard permission="view-users">
        <UserManagement 
          canCreate={hasPermission(user.role, "create-user")}
          canEdit={hasPermission(user.role, "edit-user")}
          canDelete={hasPermission(user.role, "delete-user")}
        />
      </PermissionGuard>
      
      <PermissionGuard permission="view-config">
        <SystemConfig 
          canEdit={hasPermission(user.role, "edit-config")}
        />
      </PermissionGuard>
      
      <PermissionGuard permission="view-analytics">
        <Analytics />
      </PermissionGuard>
    </div>
  );
};