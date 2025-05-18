const BASE_URL = 'https://outgi-backend-615024570161.us-central1.run.app';

const USER_CREDENTIALS = {
  username: 'user',
  password: 'password',
};

// Flag to prevent multiple simultaneous token refresh requests
let isRefreshing = false;
// Queue for requests waiting for token refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const subscribeTokenRefresh = (promise) => {
  failedQueue.push(promise);
};

// Helper function to get tokens from localStorage
const getTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  // We will keep expiresAt in storage but won't use it for client-side checks in this approach
  const accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt');
  const refreshTokenExpiresAt = localStorage.getItem('refreshTokenExpiresAt');
  return { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt };
};

// Helper function to save tokens to localStorage
const saveTokens = (accessToken, refreshToken, expiresAt) => {
  const accessTokenExpiresAt = new Date(expiresAt).getTime();
  // Assuming refresh token expires 7 days after the access token's expiry for simplicity,
  // or we could use a fixed duration like 7 days from now.
  // Let's use a fixed 7 days from now for the refresh token expiry.
  const refreshTokenExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt.toString());
  localStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt.toString());
};

// Helper function to remove tokens from localStorage
const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessTokenExpiresAt');
  localStorage.removeItem('refreshTokenExpiresAt');
};

const login = async (username, password) => {
  try {
    console.log('Attempting login...');
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Handle specific errors like 401 Unauthorized
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Save tokens upon successful login
    saveTokens(data.accessToken, data.refreshToken, data.expiresAt);
    console.log('Login successful, tokens saved.');
    return data.accessToken; // Return the new access token
  } catch (error) {
    console.error('Error during login:', error);
    // Clear tokens on login failure as any existing tokens are likely invalid
    removeTokens();
    throw error;
  }
};

const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise(resolve => {
      subscribeTokenRefresh(resolve);
    });
  }

  console.log('Attempting to refresh token...');
  isRefreshing = true;

  try {
    const { refreshToken: currentRefreshToken } = getTokens();


    if (!currentRefreshToken) { // Corrected condition here
     console.log('No refresh token available for refreshing.');
     throw new Error('No refresh token available');
    }

    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        // Include the refresh token in the header for the refresh endpoint
        'Authorization': `Bearer ${currentRefreshToken}`,
      },
    });

    if (!response.ok) {
      // If refresh fails (e.g., refresh token expired or invalid server-side)
      if (response.status === 401 || response.status === 403) {
        console.error('Refresh token failed: Invalid or expired refresh token.');
        throw new Error('Invalid or expired refresh token');
      }
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Save the new tokens received from the refresh endpoint
    saveTokens(data.accessToken, data.refreshToken, data.expiresAt);
    console.log('Token refresh successful, new tokens saved.');

    // Process the queue with the new token
    processQueue(null, data.accessToken);

    return data.accessToken; // Return the new access token
  } catch (error) {
    console.error('Error during token refresh:', error);
    // If refresh fails, remove all tokens as the session is invalid
    removeTokens();

    // Process the queue with error
    processQueue(error);

    throw error;
  } finally {
    isRefreshing = false;
  }
};


// ensureToken is simplified to just retrieve the current access token.
// Token validity is now checked when making API calls.
const ensureToken = async () => {
  console.log('ensureToken: Retrieving current access token from localStorage.');
  const { accessToken } = getTokens();
  if (!accessToken){
    console.log('ensureToken: No access token found in localStorage. Attempting login.');
    // Attempt login if no access token is found
    return login(USER_CREDENTIALS.username, USER_CREDENTIALS.password);
  }
  return accessToken; // Return the stored access token (can be null or expired)
};

// Generic API call function with 401 handling
const apiCall = async (url, options = {}) => {
  let accessToken = await ensureToken();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return response;
    } else if (response.status === 401) {
      console.log(`API call to ${url} failed with 401 Unauthorized. Attempting refresh...`);
      // Access token invalid, attempt to refresh
      try {
        const newAccessToken = await refreshToken();
        console.log('Token refreshed. Retrying original API call...');

        // Retry the original API call with the new access token
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          },
        });

        if (retryResponse.ok) {
          return retryResponse;
        } else if (retryResponse.status === 401) {
             console.error('Retry API call failed with 401 Unauthorized. Both tokens might be invalid.');
             removeTokens();
             throw new Error('Session expired. Please login again.');
         } else {
             throw new Error(`Retry API call to ${url} failed with status: ${retryResponse.status}`);
         }
      } catch (refreshError) {
        console.error('Error during token refresh or retry:', refreshError);
        removeTokens();
        throw new Error('Could not refresh session. Please login again.');
      }
    } else {
      // Handle other non-OK status codes
      throw new Error(`HTTP error! status: ${response.status} for ${url}`);
    }
  } catch (error) {
    console.error(`Error during API call to ${url}:`, error);
    throw error;
  }
};

const getMenu = async () => {
  console.log('Attempting to fetch menu...');
  const response = await apiCall(`${BASE_URL}/api/menu`);
  const data = await response.json();
  return data;
};

const submitOrder = async (order) => {
    console.log('Attempting to submit order...');
    const response = await apiCall(`${BASE_URL}/api/submit-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    const data = await response.json();
    return data;
};

const getOrderHistory = async () => {
  console.log('Attempting to fetch order history...');
  const response = await apiCall(`${BASE_URL}/api/order-history`);
  const data = await response.json();
   // Mocked order history data - replace with real data from API response
  return data;
};

export { getMenu, submitOrder, getOrderHistory, ensureToken };
