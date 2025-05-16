import React, { useEffect, useMemo } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { mockOrders, Order } from './data/mockOrders';
import OrderCard from './OrderCard';
import OrderCardSkeleton from './OrderCardSkeleton';
import { useOrderHistoryStore } from './store/orderHistoryStore';
import RefreshButton from './RefreshButton';
// Removed: import { useNavigate } from '@tanstack/react-router'; - as navigate is not used

const fetchOrders = async (): Promise<Order[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockOrders), 500));
};

const OrderHistory: React.FC = () => {
    // Removed: const navigate = useNavigate();
    const { orders, setOrders } = useOrderHistoryStore((state) => state);

    const queryOptions: UseQueryOptions<Order[]> = useMemo(() => ({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    }), []);

    const { data: ordersData, isLoading, error, refetch } = useQuery(queryOptions);

    useEffect(() => {
        if (ordersData) {
            setOrders(ordersData);
        }
    }, [ordersData, setOrders]);

    const handleRefresh = () => refetch();

    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [orders]);

    const goBack = () => window.history.back();

    if (isLoading) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Order History</h1>
                <button onClick={goBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
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
                <button onClick={goBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
                <RefreshButton onClick={handleRefresh} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>
            <button onClick={goBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
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
