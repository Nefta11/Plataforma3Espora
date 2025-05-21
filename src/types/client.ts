export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  description?: string;
  contacts?: Contact[];
  createdAt: string;
  createdBy: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
}