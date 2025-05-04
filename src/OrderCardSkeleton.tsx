import React from 'react';
import ContentLoader from 'react-content-loader';

const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ContentLoader
        speed={2}
        width={380}
        height={100}
        viewBox="0 0 380 100"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="3" ry="3" width="100" height="10" />
        <rect x="120" y="0" rx="3" ry="3" width="50" height="10" />
        <rect x="0" y="20" rx="3" ry="3" width="150" height="8" />
        <rect x="0" y="50" rx="3" ry="3" width="50" height="8" />
        <rect x="330" y="50" rx="3" ry="3" width="50" height="8" />
      </ContentLoader>
    </div>
  );
};

export default OrderCardSkeleton;