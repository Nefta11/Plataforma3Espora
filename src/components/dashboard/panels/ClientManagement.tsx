import React from "react";
import { Plus, FileEdit, Trash } from "lucide-react";
import { Button } from "../../ui/Button";

interface ClientManagementProps {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({
  canCreate,
  canEdit,
  canDelete
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Client Management</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-4">
          Manage your client accounts, edit details, and control access
        </p>
        
        <div className="flex flex-wrap gap-2">
          {canCreate && (
            <Button size="sm" className="flex items-center">
              <Plus size={16} className="mr-1" />
              Add Client
            </Button>
          )}
          
          {canEdit && (
            <Button size="sm" variant="outline" className="flex items-center">
              <FileEdit size={16} className="mr-1" />
              Edit Clients
            </Button>
          )}
          
          {canDelete && (
            <Button size="sm" variant="outline" className="flex items-center">
              <Trash size={16} className="mr-1" />
              Remove Clients
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};