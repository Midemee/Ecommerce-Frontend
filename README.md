# MiniStore — Vite React Frontend

React + Vite frontend for the MiniStore FastAPI backend.

## Main routes
- `/` — landing page
- `/register` — shared registration page; all new accounts register as customers by default.
- `/signin` — shared sign-in page; the backend determines the signed-in user role.
- `/products` — customer-only products/cart page
- `/inventory` — storekeeper-only inventory management

The separate storekeeper registration and sign-in pages have been removed. All users use the same authentication pages. Existing customers can be promoted to storekeepers from the Team section in the storekeeper inventory area.

## Backend configuration
Set `VITE_API_URL` in `.env` to the FastAPI base URL. Defaults to `http://127.0.0.1:8001`.

```bash
npm install
npm run dev
```

Vite runs at `http://127.0.0.1:5500` as configured in `vite.config.js`. Make sure the backend CORS `allow_origins` includes this exact origin.

## API alignment
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/promote` (storekeeper-only; requires the target customer email)
- Inventory requests use `Authorization: Bearer <access_token>` and no longer send a storekeeper email as an authorization claim.
- Inventory product IDs are treated as UUID strings.
- Cart and sales API helper functions are defined for the supplied backend routes.

The frontend role checks are for navigation and usability. FastAPI `require_customer` / `require_storekeeper` remains the actual security boundary.
# Ecommerce-Frontend
