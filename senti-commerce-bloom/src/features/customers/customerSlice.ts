
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
}

interface CustomerState {
  items: Customer[];
}

// Mock data for initial state
const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    totalOrders: 5,
    totalSpent: 250.75,
    joinDate: '2025-01-15',
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    totalOrders: 3,
    totalSpent: 150.00,
    joinDate: '2025-02-20',
  },
  {
    id: 'CUST003',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '555-555-5555',
    totalOrders: 8,
    totalSpent: 450.50,
    joinDate: '2024-11-10',
  },
  {
    id: 'CUST004',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '111-222-3333',
    totalOrders: 1,
    totalSpent: 35.50,
    joinDate: '2025-03-01',
  },
  {
    id: 'CUST005',
    name: 'Bob Brown',
    email: 'bob.b@example.com',
    phone: '444-555-6666',
    totalOrders: 12,
    totalSpent: 1200.00,
    joinDate: '2023-12-12',
  },
    {
    id: 'CUST006',
    name: 'Charlie Davis',
    email: 'charlie.d@example.com',
    phone: '777-888-9999',
    totalOrders: 2,
    totalSpent: 99.98,
    joinDate: '2025-04-10',
  },
  {
    id: 'CUST007',
    name: 'Diana Miller',
    email: 'diana.m@example.com',
    phone: '123-123-1234',
    totalOrders: 7,
    totalSpent: 345.67,
    joinDate: '2025-05-21',
  },
  {
    id: 'CUST008',
    name: 'Ethan Wilson',
    email: 'ethan.w@example.com',
    phone: '456-456-4567',
    totalOrders: 4,
    totalSpent: 180.25,
    joinDate: '2025-06-01',
  },
];

const initialState: CustomerState = {
  items: mockCustomers,
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<{ name?: string; email?: string; phone?: string; }>) => {
      const newCustomer: Customer = {
        id: `CUST${String(state.items.length + 1).padStart(3, '0')}`,
        ...(action.payload as { name: string; email: string; phone: string; }),
        totalOrders: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().split('T')[0],
      };
      state.items.unshift(newCustomer);
    },
    updateCustomer: (state, action: PayloadAction<Partial<Pick<Customer, 'name' | 'email' | 'phone'>> & { id: string }>) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customerSlice.actions;
export default customerSlice.reducer;
