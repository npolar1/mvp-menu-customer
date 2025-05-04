import { create } from 'zustand';
import { Order } from '../data/mockOrders';


interface OrderHistoryState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export const useOrderHistoryStore = create<OrderHistoryState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
}));