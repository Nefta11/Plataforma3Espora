import React from "react";
import { UserPlus, UserCog, UserMinus } from "lucide-react";
import { Button } from "../../ui/Button";

interface UserManagementProps {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  canCreate,
  canEdit,
  canDelete
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">User Management</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-4">
          Manage system users, assign roles, and control permissions
        </p>
        
        <div className="flex flex-wrap gap-2">
          {canCreate && (
            <Button size="sm" className="flex items-center">
              <UserPlus size={16} className="mr-1" />
              Add User
            </Button>
          )}
          
          {canEdit && (
            <Button size="sm" variant="outline" className="flex items-center">
              <UserCog size={16} className="mr-1" />
              Manage Roles
            </Button>
          )}
          
          {canDelete && (
            <Button size="sm" variant="outline" className="flex items-center">
              <UserMinus size={16} className="mr-1" />
              Remove Users
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};