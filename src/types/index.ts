export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bitrixContactId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  title: string;
  status: string;
  amount: number;
  date: string;
  description?: string;
}

export interface Payment {
  id: number;
  userId: number;
  title: string;
  status: string;
  amount: number;
  date: string;
  action: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentFilter {
  name?: string;
  status?: string;
  action?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}
