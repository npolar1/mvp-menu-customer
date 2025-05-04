import React from 'react'; // Add this import
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import OrderHistory from './OrderHistory';
import App from './App';

// 1. Create root route
const rootRoute = createRootRoute({
  component: Root,
});

// 2. Define Root component with proper React import
function Root() {
  return (
    <>
      {/* Your layout components can go here */}
      <Outlet /> {/* This renders the matched child route */}
    </>
  );
}

// 3. Create child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-history',
  component: OrderHistory,
});

// 4. Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  orderHistoryRoute
]);

// 5. Create router
export const router = createRouter({
  routeTree,
});

// 6. Type declarations
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
