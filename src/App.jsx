import { useState, useEffect } from 'react'
import { FiShoppingCart, FiArrowUp } from 'react-icons/fi'
import { mockMenuData } from './data/mockData'
import { debounce } from './utils/helpers';
import Cart from './Cart'; // Import the Cart component


export default function App() {
  const [menu, setMenu] = useState({ categories: [], items: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [cart, setCart] = useState([]) // Initialize cart state
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart visibility

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        setMenu(mockMenuData)
        setActiveCategory(mockMenuData.categories[0]) // Set the first category as active
      } catch (err) {
        setError('Failed to load menu: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    // Load cart data from local storage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    
    loadData()
  }, [])

   // Scroll to top functionality
   
   useEffect(() => {
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const categoryElements = mockMenuData.categories.map(category => 
      document.getElementById(category)
    ).filter(Boolean);
  
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500);
  
      // Find active category
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
  
    const debouncedScroll = debounce(handleScroll, 50);
    window.addEventListener('scroll', debouncedScroll);
    handleScroll(); // Initial check
  
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [loading, activeCategory, mockMenuData.categories]); // Add proper dependencies

  const scrollToCategory = (category) => {
    setActiveCategory(category)
    const element = document.getElementById(category)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const addToCart = (item) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart, item];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white shadow-sm z-20">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">FoodApp</h1>
          <button className="relative" onClick={toggleCart}> {/* Toggle cart visibility */}
            <FiShoppingCart className="text-2xl text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cart.length}
            </span>
          </button>
        </div>

        {/* Category Navigation Ribbon */}
        <div className="border-t bg-white sticky top-14 z-10">
          <div className="flex overflow-x-auto px-4 hide-scrollbar">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="h-10 w-24 bg-gray-200 animate-pulse rounded-full mr-2"
                />
              ))
            ) : (
              menu.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={`shrink-0 px-4 py-2 mr-2 rounded-full transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </div>
      </header>

      <main className="p-4">
        {loading ? (
          // Loading skeletons
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
            <section key={category} 
              id={category}
              className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.items
                  .filter(item => item.category === category)
                  .map(item => (
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
                        <button 
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          onClick={() => addToCart(item)}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Conditionally render the Cart component */}
      {isCartOpen && (
        <Cart cart={cart} setCart={setCart} />
      )}
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <FiArrowUp className="text-xl" />
        </button>
      )}

    </div>
  )
}