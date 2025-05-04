import React from 'react';

const Cart = ({ cart, setCart }) => {
  const handleRemoveItem = (itemId) => {
    setCart(currentCart => {
      const updatedCart = currentCart.filter(item => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  if (cart.length === 0) {
    return (
      <div className="p-4">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id} className="flex items-center justify-between py-2 border-b">
            <span>{item.name} ({item.quantity})</span>
            <div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border rounded"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;