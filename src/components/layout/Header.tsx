import React, { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };


  return (
    <header className="bg-white border-b border-gray-200 py-0.5 px-6 flex items-center justify-between">
      <div className="flex-1">
        <Logo />
      </div>

      {user && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} className="text-gray-500" />
                )}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar sesión
            </Button>

            <Modal
              isOpen={showLogoutModal}
              onClose={() => setShowLogoutModal(false)}
              title="¿Cerrar sesión?"
            >
              <div className="space-y-6">
                <p className="text-gray-600 text-sm text-center">
                  ¿Estás seguro que deseas cerrar tu sesión? Necesitarás volver a iniciar sesión para acceder al sistema.
                </p>
                <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6"
                >
                  Mantener sesión
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-6"
                >
                  Cerrar sesión
                </Button>
                </div>
              </div>
            </Modal>
          </div>
        </>
      )}
    </header>
  );
};