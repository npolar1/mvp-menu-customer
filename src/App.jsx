import { useState, useEffect } from 'react';
// Removed: import { useRouteContext } from '@tanstack/react-router';
import { useCart } from './router'; // Import the custom useCart hook
import { mockMenuData } from './data/mockData';
import { ensureToken } from './api/menuApi';
import OrderCardSkeleton from './OrderCardSkeleton';
import { debounce } from './utils/helpers'; // Ensure debounce is imported if used

export default function App() {
  // Use the custom useCart hook to get cart state and functions
  const { cart, handleQuantityChange, addToCart } = useCart();

  const [menu, setMenu] = useState(mockMenuData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');

  // We'll keep the menu data fetching and category scrolling logic here
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMenu(mockMenuData);
        setActiveCategory(mockMenuData.categories[0]); // Set the first category as active
      } catch (err) {
        setError('Failed to load menu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Adjust headerHeight reference if header is now in Root component
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const categoryElements = mockMenuData.categories.map(category =>
      document.getElementById(category)
    ).filter(Boolean);

    const handleScroll = () => {
      // Adjust scrollPosition calculation if header is now in Root component
      const scrollPosition = window.scrollY + headerHeight + 10;
      let currentCategory = '';
      categoryElements.forEach(element => {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentCategory = element.id;
        }
      });
      if (currentCategory && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
      }
    };

    // Assuming debounce is still needed and available from utils/helpers
    const debouncedScroll = debounce(handleScroll, 50);
    window.addEventListener('scroll', debouncedScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [loading, activeCategory, mockMenuData.categories]); // Added mockMenuData.categories dependency

  const scrollToCategory = (category) => {
    const element = document.getElementById(category);
    if (element) {
      requestAnimationFrame(() => {
        setActiveCategory(category);
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
    }
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  // Render loading state or actual menu content
  return (
    <div className="min-h-screen px-4"> {/* Added padding and min-height for standalone content */}
      {/* Category Navigation Ribbon */}
      {loading ? (
        <div className="flex overflow-x-auto px-4 hide-scrollbar mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full mr-2" />
          ))}
        </div>
      ) : (
        
        <div className="bg-white">
          <div className="flex overflow-x-auto px-4 hide-scrollbar">
            {menu.categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`shrink-0 px-4 py-2 mr-2 rounded-full transition-colors ${activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Content */}
      {loading ? (
        // Loading skeletons for the main order page
        [...Array(4)].map((_, catIdx) => (
          <div key={catIdx} className="mb-8">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, itemIdx) => (
                <div
                  key={itemIdx}
                  className="h-48 bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        // Actual menu content
        menu.categories.map((category) => (
          <section key={category} id={category} className="mb-8 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu.items
                .filter(item => item.category === category)
                .map(item => {
                  // Access cart from the useCart hook
                  const cartItem = cart.find(cartItem => cartItem.id === item.id);
                  const quantity = cartItem ? cartItem.quantity : 0;
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">
                          ${item.price.toFixed(2)}
                        </span>
                        {quantity > 0 ? (
                          <div className="flex items-center">
                            <button
                              className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="w-12 text-center border-t border-b px-1 py-1">{quantity}</span>
                            <button
                              className="bg-gray-300 text-gray-800 px-2 py-1 rounded-r"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={() => addToCart(item)}
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
