export type Order = { 
  id: string;
  date: Date;
  itemCount: number;
  totalAmount: number;
  status: 'ordered' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    itemCount: 3,
    totalAmount: 35.50,
    status: 'ordered',
  },
  {
    id: 'order-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 1),
    itemCount: 2,
    totalAmount: 22.00,
    status: 'preparing',
  },
  {
    id: 'order-3',
    date: new Date(Date.now() - 1000 * 60 * 30),
    itemCount: 1,
    totalAmount: 10.00,
    status: 'ready',
  },
  {
    id: 'order-4',
    date: new Date(Date.now() - 1000 * 60 * 10),
    itemCount: 4,
    totalAmount: 48.75,
    status: 'delivered',
  },
  {
    id: 'order-5',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3),
    itemCount: 2,
    totalAmount: 18.99,
    status: 'cancelled',
  },
];


