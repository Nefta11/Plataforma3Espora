import React from "react";
import { LoginForm } from "../components/auth/LoginForm";

export const LoginScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B14] flex items-center justify-center">
      <LoginForm />
    </div>
  );
};