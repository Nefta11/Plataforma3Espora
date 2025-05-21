import React from "react";
import { Navigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { StageMatrix } from "../components/dashboard/StageMatrix";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

export const DashboardScreen: React.FC = () => {
  const { user, selectedClient } = useAuth();
  
  if (!selectedClient) {
    return <Navigate to="/clients" replace />;
  }
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Header />
      
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div className="px-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {selectedClient?.logoUrl ? (
                <img
                  src={selectedClient.logoUrl}
                  alt={selectedClient.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-gray-500" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900">{selectedClient?.name}</p>
          </div>
          
          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-900">Etapas del Proyecto</h1>
            <p className="text-xs text-gray-600">
              Matriz de acceso por etapas según roles del equipo
            </p>
          </div>
        </div>
        
        <div className="flex-1 p-2">
          <StageMatrix />
        </div>
      </div>
    </div>
  );
};