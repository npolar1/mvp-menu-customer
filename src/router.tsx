import React, { useState, useEffect, useRef, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router';
import { FiShoppingCart, FiArrowUp } from 'react-icons/fi';
import OrderHistory from './OrderHistory';
import App from './App';
import Cart from './Cart';
import { debounce } from './utils/helpers';
import { ensureToken } from './api/menuApi';

// Define a type for cart items based on mockData structure
interface CartItem {
  id: number; // Assuming id is a number
  quantity: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Define the type for our Cart Context
interface CartContextType {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  handleQuantityChange: (itemId: number, delta: number) => void;
  addToCart: (item: CartItem) => void;
}

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 1. Create root route
const rootRoute = createRootRoute({
  component: Root,
});

// 2. Define Root component with global layout and state, providing CartContext
function Root() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [itemCount, setItemCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItemCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const debouncedScroll = debounce(() => {
      setShowScrollTop(window.scrollY > 500);
    }, 50);
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  useEffect(() => {
    ensureToken(); // Ensure token is available on app load
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const toggleCart = () => {
    if (cart.length > 0) {
      requestAnimationFrame(() => {
        if (cartRef.current) {
          cartRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        }
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleQuantityChange = (itemId: number, delta: number) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity < 1 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
      return updatedCart;
    });
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }
      return updatedCart;
    });
  };

  const handleCloseCart = () => {
     setCart([]); // Clear cart on close, or implement a different close behavior if needed
  };


  return (
    <CartContext.Provider value={{ cart, setCart, handleQuantityChange, addToCart }}>
      <div className="min-h-screen">
        <header className="sticky top-0 bg-white shadow-sm z-20">
          <div className="p-4 flex justify-between items-center relative">
            <button className="burger-icon" onClick={toggleMenu}>
              ☰
            </button>
            {/* Full-screen menu */}
            <nav className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <ul className="flex flex-col p-4 space-y-4">
                <li><Link to="/" onClick={toggleMenu} className="text-lg font-semibold text-gray-800 hover:text-blue-500">Order</Link></li>
                <li><Link to="/order-history" onClick={toggleMenu} className="text-lg font-semibold text-gray-800 hover:text-blue-500">Order History</Link></li>
                <li><Link to="/login" onClick={toggleMenu} className="text-lg font-semibold text-gray-800 hover:text-blue-500">Login</Link></li>
              </ul>
            </nav>
            {/* Overlay */}
            {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleMenu}></div>}
            <h1 className="text-xl font-bold text-gray-800">FoodApp</h1>
            <button className="relative" onClick={toggleCart}>
              <FiShoppingCart className="text-2xl text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            </button>
          </div>
          {/* Category Navigation Ribbon remains in App.jsx */}
        </header>
        <main className="p-4">  
          <Outlet />
        </main>

        <div ref={cartRef}> {/* Cart component should ideally be an overlay */} {/* The ref is for scrolling, reconsider if Cart is a fixed/modal overlay */}
          {cart.length > 0 && (
            <Cart cart={cart} setCart={setCart} onClose={handleCloseCart} />
          )}
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 bg-blue-300 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <FiArrowUp className="text-xl" />
          </button>
        )}
      </div>
    </CartContext.Provider>
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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <div>Login (Fake)</div>,
});

// 4. Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  orderHistoryRoute,
  loginRoute
]);

// 5. Create router
export const router = createRouter({
  routeTree,
});

// 6. Type declarations for TanStack Router (minimal)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
