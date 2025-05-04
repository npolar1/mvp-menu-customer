import React from 'react';

const Cart = ({ cart, setCart, onClose }) => {
  
  const handleRemoveItem = (itemId) => {
    setCart(currentCart => {
      const updatedCart = currentCart.filter(item => item.id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };
  const handleCloseCart = () => {
    if (onClose) {
      onClose();
    }
  };
  const handleQuantityChange = (itemId, delta) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity < 1) {
            return null; // Mark for removal
          } else {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }).filter(item => item !== null); // Remove marked items
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleCloseCart}>×</button>

        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleCloseCart}>×</button>
      <h2 className="text-lg font-bold mb-4">Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id} className="flex items-center justify-between py-2 border-b">
            <div>
              <span className="font-semibold">{item.name}</span>
              <span className="ml-2 text-gray-600">(${item.price.toFixed(2)})</span>
            </div>
            <div className="flex items-center">
              <button
                className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l"
                onClick={() => handleQuantityChange(item.id, -1)}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) - item.quantity)}
                className="w-12 text-center border-t border-b px-1 py-1"
              />
              <button
                className="bg-gray-300 text-gray-800 px-2 py-1 rounded-r"
                onClick={() => handleQuantityChange(item.id, 1)}
              >
                +
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded ml-4"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between items-center font-bold">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <div className="mt-4 text-center">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};
Cart.defaultProps = {
  onClose: () => {},
};
export default Cart;