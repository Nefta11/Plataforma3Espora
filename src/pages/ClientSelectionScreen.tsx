import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { MOCK_CLIENTS } from "../data/mockClients";
import { ClientCarousel } from "../components/client/ClientCarousel";
import { AddAccountModal } from "../components/client/AddAccountModal";
import { Header } from "../components/layout/Header";
import { Client } from "../types/client";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../data/roles";
import { Button } from "../components/ui/Button";

export const ClientSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, setSelectedClient } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  
  useEffect(() => {
    // Create infinite carousel by duplicating clients
    const duplicatedClients = [...MOCK_CLIENTS, ...MOCK_CLIENTS, ...MOCK_CLIENTS];
    setClients(duplicatedClients);
  }, []);
  
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    navigate('/dashboard');
  };

  const handleAddAccount = async (data: { name: string; logoUrl: string }) => {
    const newClient: Client = {
      id: String(Date.now()),
      name: data.name,
      logoUrl: data.logoUrl,
      description: "",
      createdAt: new Date().toISOString(),
      createdBy: user?.id || "unknown"
    };

    setClients(prev => [...prev, newClient]);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="flex-1 flex flex-col items-center p-8 animate-fade-in">
        <div className="w-full max-w-6xl">
          <div className="relative mb-12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center">
              Cuentas
            </h1>
            <p className="text-gray-600 text-center mt-3 max-w-lg mx-auto">
              Selecciona una cuenta para acceder a su dashboard y gestionar sus proyectos
            </p>
            {user && hasPermission(user.role, "create-client") && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2
                  bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700
                  transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus size={20} />
                Agregar Cuenta
              </Button>
            )}
          </div>

          <ClientCarousel
            clients={clients}
            onSelectClient={handleSelectClient}
          />
          
          <AddAccountModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddAccount}
            existingNames={clients.map(c => c.name)}
          />
        </div>
      </div>
    </div>
  );
};