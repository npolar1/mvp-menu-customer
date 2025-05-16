import { mockMenuData } from '../data/mockData';

const getMenu = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMenuData);
    }, 1500);
  });
};

const submitOrder = (order) => {
    return new Promise((resolve, reject) => {
    
    const orderId = Math.random().toString(36).substring(2, 9).toUpperCase(); // Generate a random order ID
    const isSuccess = false //Math.random() > 0.5;  Randomly determine success or failure
    setTimeout(() => {
      if (isSuccess) {
        resolve({
          message: "Order submitted successfully",
          orderId: orderId,
        });
      } else {
        reject({
          message: "Error submitting order, try again",
        });
      }
    }, 1000);
  });
};

const getOrderHistory = async () => {
  // Mocked order history data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'order-1',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2),
          itemCount: 3,
          totalAmount: 35.5,
          status: 'ordered',
        },
        {
          id: 'order-2',
          date: new Date(Date.now() - 1000 * 60 * 60 * 1),
          itemCount: 2,
          totalAmount: 22.0,
          status: 'preparing',
        },
      ]);
    }, 1000);
  });
};

const getAnonymousToken = async () => {
  // Mocked token generation
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = 'mocked-token';
      const expiresIn = 86400; // 1 day in seconds
      const expirationTime = Date.now() + expiresIn * 1000;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authTokenExpiration', expirationTime);

      resolve(token);
    }, 500);
  });
};

const ensureToken = async () => {
  const token = localStorage.getItem('authToken');
  const expirationTime = localStorage.getItem('authTokenExpiration');

  if (!token || !expirationTime || Date.now() > expirationTime) {
    return await getAnonymousToken();
  }

  return token;
};

export { getMenu, submitOrder, getOrderHistory, ensureToken };