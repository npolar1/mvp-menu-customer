import React, { useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { mockOrders, Order } from './data/mockOrders';
import OrderCard from './OrderCard';
import OrderCardSkeleton from './OrderCardSkeleton';
import { useOrderHistoryStore } from './store/orderHistoryStore';
import RefreshButton from './RefreshButton'; // Import RefreshButton

const fetchOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockOrders), 500));
};


const OrderHistory: React.FC = () => {
    const { orders, setOrders } = useOrderHistoryStore((state) => state);

    const queryOptions: UseQueryOptions<Order[]> = {
        queryKey: ['orders'],
        queryFn: fetchOrders,
    };

    const { data: ordersData, isLoading, error, refetch } = useQuery(queryOptions);

    useEffect(() => {
        if (ordersData) {
            setOrders(ordersData);
        }
    }, [ordersData, setOrders]);

    const handleRefresh = () => refetch();

    if (isLoading) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Order History</h1>
                <RefreshButton onClick={handleRefresh} className="mb-4" />
                <div className="space-y-4">
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                </div>
            </div>
        );
    }
    
      if (error) {
          return <div className="p-4 text-red-500">Error: {error.message}</div>;
      }
  
      if (orders.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center h-full p-4">
                  <div className="w-48 h-48 bg-gray-200 rounded-full mb-4" />
                  <p className="text-gray-600">No recent orders...</p>
                  <RefreshButton onClick={handleRefresh} />
              </div>
          );
      }
  
    const sortedOrders = [...orders].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>
            <RefreshButton onClick={handleRefresh} className="mb-4" />
            <div className="space-y-4">
                {sortedOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );

};

export default OrderHistory;
