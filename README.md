# KrishiBazar — Bangladesh Agricultural Marketplace

KrishiBazar (কৃষিবাজার) is a Bangla-first agricultural marketplace and market price dashboard for Bangladesh. The project connects farmers and buyers through a product discovery experience, market price information, role-based dashboards, and user accounts powered by a Next.js frontend and Express + Prisma backend.

## Project Overview

The repository contains a two-part monorepo:

- `krishibazar-client/` — Next.js 16 frontend UI with React 19 and TypeScript.
- `KrishiBazar-server/` — Express 5 server with Prisma 7 and PostgreSQL integration.

The application supports three user roles:

- Admin
- Farmer
- Buyer

It includes dashboards, product publishing, market price cards, contact submission, and authentication flows.

## Core Features

### Marketplace

- Product listing and search across title, category, location, and description.
- Product detail routes and product cards.
- Featured product support through the `featured` Boolean field.
- Product creation, update, and deletion in the product services.
- Admin product management page with product deletion confirmation workflow.

### Market Price System

- Daily or date-based market price entries with title, image, location, category, quantity, unit, and price status.
- Market price filters by category, location, search, and price movement (`increased`, `decreased`, `stable`).
- Product cards for market price comparison where the UI translates product names and categories into Bangla labels.

### Dashboard & Roles

- Admin dashboard pages for users, farmers, buyers, products, orders, market prices, and settings.
- Role-aware navigation and dashboard layout with a `RoleGuard` pattern.
- Separate farmer and buyer dashboard menus and screens.

### Authentication

- User registration and login endpoints using Express routes and JWT.
- Password hashing with `bcryptjs`.
- Middleware-free JWT support through the Express services.
- Current-user retrieval through `/users/me`.

### Contact

- Contact form submission stored through Prisma `Contact` records.

## Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- React Icons
- React Toastify

### Backend

- Express 5.2.1
- TypeScript
- Prisma 7.9.1
- PostgreSQL via Prisma PostgreSQL adapter
- JWT authentication
- bcryptjs
- CORS and dotenv

## Architecture

The project adopts a simple route/service structure:

```text
KrishiBazar-server/
  src/
    app.ts              # Express application
    server.ts           # Starts server on PORT
    routes/index.ts     # Mounts /products, /users, /marketPrice, /contact, /orders
    services/           # Route handlers for each resource
    lib/prisma.ts       # Prisma singleton
```

On the client side, the UI is organized by page route and reusable component folders.

## API Structure

The backend exposes the routes under `/api/v1`:

- `/api/v1/products`
- `/api/v1/users`
- `/api/v1/marketPrice`
- `/api/v1/contact`
- `/api/v1/orders`

The API writes JSON payloads in the format:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": []
}
```

The frontend `apiClient()` in the client API wrapper checks response text and `Content-Type` before JSON parsing. This prevents routes accidentally returning HTML pages from being parsed as JSON.

## Database Model

The Prisma schema currently contains the following models:

- `User`
- `Product`
- `MarketPrice`
- `Contact`

Core product fields include:

- `id`
- `title`
- `description`
- `price`
- `quantity`
- `unit`
- `image`
- `location`
- `category`
- `featured`

The schema also includes an enum `Role` with:

- `admin`
- `farmer`
- `buyer`

## Local Setup

### 1. Install dependencies

```bash
cd krishibazar-client
npm install

cd ../KrishiBazar-server
npm install
```

### 2. Configure environment variables

Create a `.env` file in the server package. The server service expects the following environment variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=5000
```

The client uses `NEXT_PUBLIC_API_URL` to point at the backend API URL. If not provided, it falls back to:

```text
http://localhost:5000/api/v1
```

### 3. Run development servers

Start the API first:

```bash
cd KrishiBazar-server
npm run dev
```

Then start the frontend:

```bash
cd krishibazar-client
npm run dev
```

The client should run on the default Next.js port (`http://localhost:3000`), while the server listens on the configured `PORT` or `5000`.

## Production Build

### Server

```bash
cd KrishiBazar-server
npm run build
npm start
```

### Client

```bash
cd krishibazar-client
npm run build
npm start
```

## Project Folder Layout

```text
KrishiBazar/
  requirements.md
  README.md                    # project documentation
  krishibazar-client/          # Next.js UI
  KrishiBazar-server/          # Express + Prisma API
```

## Important Notes

- The API and UI are currently separated into two runnable packages.
- The frontend uses environment configuration for API base URL selection.
- Orders in the current server implementation are represented as in-memory demo data and are not yet persisted in Prisma.
- Product creation is implemented in the Express product service and matches the current Prisma `Product` model fields.

## Roadmap & Future Directions

The project already has a strong base for the following extensions:

- Persist orders in Prisma rather than using in-memory sample data.
- Add a product-to-farmer or product-to-user relation in the product schema for stronger ownership tracking.
- Add admin approval flows for product moderation if needed.
- Add secure cart, checkout, and payment integration.
- Expand market price scraping or import flows for public commodity pricing.

## Conclusion

KrishiBazar is a full-stack agricultural marketplace concept that combines a Bangla-first user experience with a modern Next.js, Express, and Prisma architecture. It is structured to support full-personality role dashboards and direct farmer-to-buyer product workflows across a Bangladesh-focused supply chain experience.
