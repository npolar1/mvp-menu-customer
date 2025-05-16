# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API Documentation for Backend Developers

### Overview
This project is a menu and order management system for a restaurant. The frontend expects the backend to provide endpoints for fetching menu data, submitting orders, and retrieving order history. Below are the details of the expected API endpoints, methods, and data structures.

---

### Endpoints

#### 1. **Fetch Menu Data**
- **Endpoint**: `/api/menu`
- **Method**: `GET`
- **Description**: Retrieves the menu data, including categories and items.
- **Response Example**:
  ```json
  {
    "categories": ["Entrantes", "Principales", "Postres", "Bebidas"],
    "items": [
      {
        "id": 1,
        "category": "Entrantes",
        "name": "Garlic Bread",
        "description": "Toasted ciabatta with herb butter",
        "price": 6.99,
        "image": "url-to-image"
      },
      {
        "id": 2,
        "category": "Entrantes",
        "name": "Bruschetta",
        "description": "Fresh tomatoes, basil, and olive oil on grilled bread",
        "price": 8.5,
        "image": "url-to-image"
      }
    ]
  }
  ```

#### 2. **Submit Order**
- **Endpoint**: `/api/orders`
- **Method**: `POST`
- **Description**: Submits a new order.
- **Request Body Example**:
  ```json
  {
    "orderId": "20250507-abc123",
    "items": [
      { "id": 1, "quantity": 2 },
      { "id": 3, "quantity": 1 }
    ]
  }
  ```
- **Response Example**:
  ```json
  {
    "orderId": "20250507-abc123",
    "status": "success"
  }
  ```

#### 3. **Retrieve Order History**
- **Endpoint**: `/api/orders/history`
- **Method**: `GET`
- **Description**: Retrieves the order history for a user.
- **Response Example**:
  ```json
  [
    {
      "orderId": "20250507-abc123",
      "date": "2025-05-07",
      "items": [
        { "id": 1, "name": "Garlic Bread", "quantity": 2, "price": 6.99 },
        { "id": 3, "name": "Margherita Pizza", "quantity": 1, "price": 14.99 }
      ],
      "total": 28.97
    }
  ]
  ```

---

### Notes for Backend Developers
1. **Authentication**: If authentication is required, ensure to provide a token-based mechanism and document it.
2. **Error Handling**: Return appropriate HTTP status codes (e.g., `400` for bad requests, `500` for server errors) and include meaningful error messages in the response.
3. **Image URLs**: Ensure that the `image` field in the menu items contains valid URLs accessible by the frontend.
4. **Data Validation**: Validate all incoming data to ensure consistency and security.

---

Feel free to reach out to the frontend team for any clarifications or additional requirements.
