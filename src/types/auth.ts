export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type Role =
  | "alpha-sales"
  | "alpha-ssc"
  | "espora-strategy"
  | "testank-studies"
  | "espora-accompaniment"
  | "espora-management"
  | "espora-production"
  | "espora-diffusion"
  | "super-admin";

export interface RolePermission {
  role: Role;
  permissions: Permission[];
  description: string;
}

export type Permission =
  | "view-clients"
  | "create-client"
  | "edit-client"
  | "delete-client"
  | "view-users"
  | "create-user"
  | "edit-user"
  | "delete-user"
  | "view-config"
  | "edit-config"
  | "view-analytics"
  | "view-logs";

import { Client } from "./client";

export interface AuthContextType {
  user: User | null;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}