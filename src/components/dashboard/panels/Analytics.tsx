import React from "react";
import { BarChart, LineChart } from "lucide-react";
import { Button } from "../../ui/Button";

export const Analytics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Analytics & Reporting</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-4">
          View system metrics, access reports, and analyze performance data
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="flex items-center">
            <BarChart size={16} className="mr-1" />
            Usage Reports
          </Button>
          
          <Button size="sm" variant="outline" className="flex items-center">
            <LineChart size={16} className="mr-1" />
            Performance Metrics
          </Button>
        </div>
      </div>
    </div>
  );
};