import { RolePermission } from "../types/auth";

export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: "alpha-sales",
    permissions: [
      "view-clients",
      "create-client",
      "edit-client",
      "view-analytics"
    ],
    description: "Sales team with exclusive client creation privileges"
  },
  {
    role: "alpha-ssc",
    permissions: [
      "view-clients",
      "edit-client",
      "view-analytics",
      "view-config"
    ],
    description: "SSC team with client editing privileges"
  },
  {
    role: "espora-strategy",
    permissions: [
      "view-clients",
      "view-analytics",
      "view-config"
    ],
    description: "Strategy team with client viewing privileges"
  },
  {
    role: "testank-studies",
    permissions: [
      "view-clients",
      "view-analytics"
    ],
    description: "Studies team with client viewing privileges"
  },
  {
    role: "espora-accompaniment",
    permissions: [
      "view-clients",
      "view-analytics",
      "edit-client"
    ],
    description: "Accompaniment team with client viewing privileges"
  },
  {
    role: "espora-management",
    permissions: [
      "view-clients",
      "edit-client",
      "view-users",
      "view-analytics",
      "view-config",
      "edit-config"
    ],
    description: "Management team with client viewing and editing privileges"
  },
  {
    role: "espora-production",
    permissions: [
      "view-clients",
      "view-analytics"
    ],
    description: "Production team with client viewing privileges"
  },
  {
    role: "espora-diffusion",
    permissions: [
      "view-clients",
      "view-analytics"
    ],
    description: "Diffusion team with client viewing privileges"
  },
  {
    role: "super-admin",
    permissions: [
      "view-clients",
      "create-client",
      "edit-client",
      "delete-client",
      "view-users",
      "create-user",
      "edit-user",
      "delete-user",
      "view-config",
      "edit-config",
      "view-analytics",
      "view-logs"
    ],
    description: "Super admin with all privileges"
  }
];

export function hasPermission(role: string | undefined, permission: string): boolean {
  if (!role) return false;
  
  const rolePermission = ROLE_PERMISSIONS.find(r => r.role === role);
  if (!rolePermission) return false;
  
  return rolePermission.permissions.includes(permission as any);
}