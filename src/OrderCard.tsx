import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Order {
  id: string;
  date: Date;
  itemCount: number;
  totalAmount: number;
  status: 'ordered' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const truncatedId = order.id.substring(0, 8) + '...';

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Order {truncatedId}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
          {order.status}
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-2">{formatDistanceToNow(order.date, { addSuffix: true })}</div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">{order.itemCount} items</span>
        <span className="font-medium text-gray-800">${order.totalAmount.toFixed(2)}</span>
      </div>  
    </div>
  );
};

export default OrderCard;