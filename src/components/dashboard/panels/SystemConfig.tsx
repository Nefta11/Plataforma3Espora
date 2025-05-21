import React from "react";
import { Settings, Database } from "lucide-react";
import { Button } from "../../ui/Button";

interface SystemConfigProps {
  canEdit: boolean;
}

export const SystemConfig: React.FC<SystemConfigProps> = ({ canEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">System Configuration</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-4">
          Configure system settings, manage global parameters and integrations
        </p>
        
        <div className="flex flex-wrap gap-2">
          {canEdit ? (
            <>
              <Button size="sm" className="flex items-center">
                <Settings size={16} className="mr-1" />
                General Settings
              </Button>
              
              <Button size="sm" variant="outline" className="flex items-center">
                <Database size={16} className="mr-1" />
                Data Management
              </Button>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">View-only access</p>
          )}
        </div>
      </div>
    </div>
  );
};