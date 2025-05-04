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
    const isSuccess = true //Math.random() > 0.5;  Randomly determine success or failure
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

export { getMenu, submitOrder };