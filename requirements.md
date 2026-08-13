# KrishiBazar (কৃষিবাজার) — Software Requirements Specification (SRS)

**Version:** 1.0  
**Status:** Draft for Review  
**Date:** 2026-08-13  
**Project:** KrishiBazar — Bangladesh Agricultural Marketplace

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Goals](#3-project-goals)
4. [Target Users](#4-target-users)
5. [User Roles & Permissions](#5-user-roles--permissions)
6. [Core Features](#6-core-features)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Business Rules](#9-business-rules)
10. [User Flows](#10-user-flows)
11. [Page/Route Requirements](#11-pageroute-requirements)
12. [Database Entity Requirements](#12-database-entity-requirements)
13. [Entity Relationships](#13-entity-relationships)
14. [API Requirements](#14-api-requirements)
15. [Authentication & Authorization](#15-authentication--authorization)
16. [Order & Stock Logic](#16-order--stock-logic)
17. [Daily Price System](#17-daily-price-system)
18. [Cart System](#18-cart-system)
19. [Payment Architecture](#19-payment-architecture)
20. [Frontend Requirements](#20-frontend-requirements)
21. [Backend Requirements](#21-backend-requirements)
22. [Security Requirements](#22-security-requirements)
23. [Error Handling](#23-error-handling)
24. [Search / Filter / Pagination](#24-search--filter--pagination)
25. [Recommended Project Architecture](#25-recommended-project-architecture)
26. [Future Scalability Considerations](#26-future-scalability-considerations)
27. [Development Phases / Implementation Roadmap](#27-development-phases--implementation-roadmap)

**Appendix A:** Identified Ambiguities & Recommendations  
**Appendix B:** Bangla UI Label Mapping

---

## 1. Project Overview

KrishiBazar (কৃষিবাজার) is a Bangladesh-focused agricultural marketplace web application that connects farmers directly with buyers.

The application serves two distinct purposes:

1. **Daily agricultural price information** — users can browse official/reference daily market prices for agricultural products (e.g., Potato ৳30/kg, Green Chili ৳150/kg, Tomato ৳80/kg) by date and location.
2. **Farmer-to-Buyer marketplace** — farmers can publish their own products (e.g., "Tomato, 20 kg, ৳80/kg") which appear instantly for buyers without any admin approval. Buyers browse, view details, add to cart, and place orders directly with farmers.

The application is designed to feel like a modern agricultural marketplace purpose-built for Bangladesh, with a Bangla-first user interface.

---

## 2. Problem Statement

Smallholder farmers in Bangladesh face two significant problems:

1. **Price information asymmetry** — farmers and buyers often do not know the fair market price of agricultural goods, leaving farmers vulnerable to middlemen who capture most of the value.
2. **Weak direct market access** — farmers struggle to reach buyers directly. Supply chains rely on intermediaries (দালাল/আড়তদার), which reduce farmer profit margins and raise buyer prices.

KrishiBazar addresses both problems by (a) publishing transparent daily market prices and (b) providing a direct farmer-to-buyer marketplace with no admin approval friction for publishing products.

---

## 3. Project Goals

| # | Goal |
|---|------|
| G1 | Provide transparent, searchable daily agricultural market prices to the public. |
| G2 | Let farmers publish and manage their own products instantly, without admin approval. |
| G3 | Let buyers discover, compare, and purchase agricultural products directly from farmers. |
| G4 | Preserve order price history so past orders are never affected by future price changes. |
| G5 | Ensure safe stock management that prevents overselling. |
| G6 | Provide role-specific dashboards (Admin, Farmer, Buyer) with relevant statistics. |
| G7 | Deliver a responsive, Bangla-first UI across desktop, tablet, and mobile. |
| G8 | Build a production-style, scalable architecture (Next.js + Express + PostgreSQL + Prisma) suitable for portfolio demonstration and future growth. |

---

## 4. Target Users

| Segment | Description | Needs |
|---------|-------------|-------|
| **Farmers** | Smallholder and medium-scale farmers in Bangladesh | Publish products, manage stock, receive and manage orders, track sales |
| **Buyers** | Households, shop owners, restaurants, retailers | Find market prices, browse farmer products, compare, order |
| **Admins** | Platform operators | Manage users, categories, daily prices, products, orders, view reports |

---

## 5. User Roles & Permissions

Only three roles exist in the system:

| Role | Enum (DB) | Bangla Label | Permissions |
|------|-----------|--------------|-------------|
| **ADMIN** | `ADMIN` | অ্যাডমিন | Full platform management: users, farmers, buyers, categories, daily prices, all products, all orders, reports, settings |
| **FARMER** | `FARMER` | কৃষক | Register/login, manage own profile, create/edit/deactivate own products, manage own stock, view/manage orders containing own products, view sales stats |
| **BUYER** | `BUYER` | ক্রেতা | Register/login, browse products, search/filter/sort, view details, manage cart, place orders, track orders, manage profile |

### Permission Matrix

| Action | ADMIN | FARMER | BUYER |
|--------|:-----:|:------:|:-----:|
| Manage users (all) | ✅ | — | — |
| Manage categories | ✅ | — | — |
| Manage daily prices | ✅ | — | — |
| View all products | ✅ | — | — |
| Create/edit own products | — | ✅ | — |
| View own products | — | ✅ | — |
| Manage own stock | — | ✅ | — |
| Browse marketplace | ✅ | ✅ | ✅ |
| Manage cart | — | — | ✅ |
| Place orders | — | — | ✅ |
| View own orders | ✅ (all) | ✅ (own products) | ✅ (own orders) |
| Update order status | ✅ | ✅ (own products) | — |
| View platform statistics/reports | ✅ | (own sales only) | — |

---

## 6. Core Features

1. **Authentication** — register, login, logout, session (JWT in HttpOnly cookies), role-based access.
2. **Daily Market Prices** — admin-managed daily price records with product name, price, unit, date, location, category; public browsing with date/search/category/location filters and price-change indicators.
3. **Product Marketplace** — buyer-facing grid of ACTIVE, in-stock farmer products with search, category filter, location filter, price range, sorting, availability, pagination.
4. **Product Details** — image(s), name, price, unit, available quantity, description, category, farmer info/location, quantity selector, add-to-cart, checkout.
5. **Farmer Product Management** — CRUD on own products; instant publish (ACTIVE); restock/reactivate; deactivate.
6. **Cart** — persistent DB cart; add/update/remove/clear; subtotal; stock validation.
7. **Order System** — checkout, transactional order + order-item creation with atomic stock reduction, order status workflow, price snapshot.
8. **Role Dashboards** — admin, farmer, buyer dashboards with statistics.
9. **Public Website** — home, daily prices, products, product details, farmers list, farmer profile, about, contact, login, register.
10. **Bangla UI** — Bangla-first user interface with English database/code values.

---

## 7. Functional Requirements

Numbered as FR-xx. Priority: **M** = Must have, **S** = Should have, **C** = Could have.

### 7.1 Authentication & Users

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Users can register with role FARMER or BUYER (ADMIN is seeded, not self-registered). | M |
| FR-02 | Users can log in with email + password; server returns JWT in an HttpOnly cookie. | M |
| FR-03 | Users can log out; server invalidates the cookie. | M |
| FR-04 | Authenticated users can fetch their own profile (`/auth/me`). | M |
| FR-05 | Users can update their own profile (name, phone, location/address, avatar). | M |
| FR-06 | Users can change their own password (verify current password). | M |
| FR-07 | Role-based middleware restricts protected routes to the correct role. | M |
| FR-08 | Admin can view all users and change user active status/role (role changes restricted for own account). | S |

### 7.2 Categories

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-09 | Categories are managed by ADMIN (e.g., সবজি/Vegetable, ফল/Fruit, মাছ/Fish, মাংস/Meat, শস্য/Grain). | M |
| FR-10 | Public can list categories (used in nav, filters, homepage). | M |
| FR-11 | Admin can create, edit, deactivate categories. Deleting a category with products is blocked (FK restrict). | S |

### 7.3 Daily Prices

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-12 | Daily price is a separate entity from marketplace products (never merged). | M |
| FR-13 | Admin can create/update/delete daily price records. | M |
| FR-14 | Public can view today's prices (default view). | M |
| FR-15 | Public can browse previous prices by date selection. | M |
| FR-16 | Public can search by product name, filter by category and location. | M |
| FR-17 | Each record shows product name, price, unit, date, location. | M |
| FR-18 | Price-change indicator (▲/▼ vs previous record for same product+location) if data supports it. | S |
| FR-19 | Optionally expose the list of available locations (for filters). | S |

### 7.4 Products (Farmer Marketplace)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | Farmer creates a product (name, description, category, price, unit, quantity, location, images) and it becomes ACTIVE immediately. | M |
| FR-21 | No admin approval workflow for products. | M |
| FR-22 | Farmer can edit own product details. | M |
| FR-23 | Farmer can deactivate (INACTIVE) or delete own product. | M |
| FR-24 | Farmer can restock (add quantity) to reactivate an OUT_OF_STOCK product. | M |
| FR-25 | When stock reaches 0, product status auto-flips to OUT_OF_STOCK. | M |
| FR-26 | Only ACTIVE products with quantity > 0 appear in the buyer marketplace. | M |
| FR-27 | Buyer marketplace supports search, category filter, location filter, price range, sort, pagination. | M |
| FR-28 | Product details page shows full info + farmer info + quantity selector + add to cart. | M |
| FR-29 | Buyer cannot add/purchase more than available stock. | M |
| FR-30 | Farmer cannot edit/delete another farmer's product (ownership enforcement). | M |

### 7.5 Cart

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-31 | Buyer can add a product to cart with a quantity. | M |
| FR-32 | Buyer can update item quantity (validated against stock). | M |
| FR-33 | Buyer can remove an item and clear the whole cart. | M |
| FR-34 | Cart persists for the buyer (database-backed). | M |
| FR-35 | Cart shows subtotal and item counts. | M |
| FR-36 | Cart stock is re-validated before checkout. | M |

### 7.6 Orders

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-37 | Buyer places an order from the cart; order + order items are created atomically. | M |
| FR-38 | Stock is reduced atomically at order time using safe conditional updates (no overselling). | M |
| FR-39 | OrderItem preserves the price and product name snapshot at purchase time. | M |
| FR-40 | Buyer sees order history and order details with status. | M |
| FR-41 | Farmer sees orders containing their products and can update status of those orders. | M |
| FR-42 | Admin can view/manage all orders. | M |
| FR-43 | A buyer can only view their own orders; a farmer only orders involving their products. | M |

### 7.7 Payments

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-44 | Payment is designed but NOT implemented initially (COD at launch is acceptable). | S |
| FR-45 | Payment entity relates to Order and stores method, status, amount, reference. | S |
| FR-46 | Architecture supports future bKash and Stripe via method enum + webhook-ready design. | S |

### 7.8 Dashboards & Stats

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-47 | Farmer dashboard: total products, active products, out-of-stock products, total orders, pending orders, estimated revenue. | M |
| FR-48 | Buyer dashboard: recent orders, total orders, active orders, cart summary. | M |
| FR-49 | Admin dashboard: total users, farmers, buyers, products, active products, orders, sales, daily-price records, recent orders/users. | M |
| FR-50 | Admin reports page with basic aggregate statistics. | S |

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | API responses paged (default page size 20); index DB query columns; marketplace queries complete in < 300 ms on development data volumes. |
| **Responsiveness** | Fully responsive for mobile (≥360 px), tablet, and desktop (≥1280 px). |
| **Accessibility** | Semantic HTML, keyboard navigable forms, adequate color contrast, Bangla font support (e.g., Hind Siliguri/Noto Sans Bengali). |
| **Usability** | Bangla-first UI labels; intuitive flows for low-digital-literacy users (large touch targets, clear CTAs). |
| **Security** | JWT in HttpOnly cookies; bcrypt hashing; role-based access; input validation; ownership checks; CORS; rate limiting; secure headers. |
| **Reliability** | Order + stock operations wrapped in DB transactions; consistent error responses. |
| **Maintainability** | Separate frontend/backend; layered backend (routes → controllers → services); TypeScript throughout. |
| **Scalability** | Stateless API (JWT) horizontally scalable; DB indexed for reads; server-rendered pages for SEO. |
| **Portability** | Runs locally via Docker (optional) or native Node + PostgreSQL; environment-configurable. |

---

## 9. Business Rules

Numbered as BR-xx. These are invariant rules that must hold.

| ID | Rule |
|----|------|
| BR-01 | Exactly three roles exist: `ADMIN`, `FARMER`, `BUYER`. |
| BR-02 | Farmers publish products directly. There is **no** admin approval workflow for products. |
| BR-03 | Admin does not approve individual products. |
| BR-04 | Only `ACTIVE` products with available quantity are purchasable. |
| BR-05 | Buyers cannot purchase unavailable or out-of-stock products. |
| BR-06 | Farmers can manage only their own products. |
| BR-07 | Farmers can view/manage only orders that include their products. |
| BR-08 | Buyers can view only their own orders. |
| BR-09 | Admin has platform-wide management access. |
| BR-10 | Daily prices are a separate concept from farmer marketplace products. |
| BR-11 | Database values and code are in English; UI displays Bangla labels via a mapping layer. |
| BR-12 | Order purchase price is preserved as a snapshot in `OrderItem`; later price changes never alter historical orders. |
| BR-13 | Stock updates must be safe against overselling (conditional atomic decrement). |
| BR-14 | Only ADMIN creates/modifies daily price records. |
| BR-15 | A farmer's product status lifecycle: `ACTIVE → OUT_OF_STOCK` (when stock hits 0), `ACTIVE/OUT_OF_STOCK → INACTIVE` (farmer deactivates), `OUT_OF_STOCK/INACTIVE → ACTIVE` (restock/reactivate). |
| BR-16 | Quantity added to an order item must be > 0 and ≤ current stock. |
| BR-17 | Duplicate daily-price records for the same (productName, unit, date, location) are not allowed (unique constraint). |

---

## 10. User Flows

### 10.1 Farmer: Publish a Product
1. Farmer registers/logs in → redirected to `/farmer`.
2. Navigates to "আমার পণ্য" (`/farmer/products`) → "পণ্য যোগ করুন" (`/farmer/products/create`).
3. Fills form (name, description, category, price, unit, quantity, location, images) → submits.
4. System validates (Zod) → creates product with status `ACTIVE` → redirects to product list with success toast.
5. Product is immediately visible in the buyer marketplace.

### 10.2 Farmer: Restock / Deactivate
1. From `/farmer/products`, farmer opens a product.
2. Adds quantity (restock) → stock increases; status may flip to `ACTIVE`.
3. Or toggles product to INACTIVE to hide from marketplace.

### 10.3 Buyer: Purchase Flow
1. Buyer logs in → browses `/products` or homepage.
2. Opens `/products/[id]`, selects quantity (capped at available stock) → "কার্টে যোগ করুন".
3. Views cart (`/buyer/cart`), adjusts quantities, sees subtotal.
4. Proceeds to checkout (`/buyer/checkout`) — stock re-validated.
5. Places order → transaction creates order + items, reduces stock, clears cart.
6. Order visible in `/buyer/orders`; status updated by farmer.

### 10.4 Farmer: Order Management
1. Farmer opens `/farmer/orders` → sees orders containing own products.
2. Opens `/farmer/orders/[id]` → sees buyer info, items, delivery address.
3. Updates status (e.g., CONFIRMED → PROCESSING → SHIPPED → DELIVERED, or CANCELLED).

### 10.5 Admin: Daily Price Entry
1. Admin logs in → `/admin/daily-prices`.
2. Creates/edits records (product name, category, price, unit, date, location) — optionally bulk entry.
3. Records appear on the public `/daily-prices` page immediately.

### 10.6 Guest: Price Discovery
1. Guest opens `/` → sees hero + today's prices + featured products.
2. Opens `/daily-prices` → browses/filters by date, category, location.
3. Opens `/products` → searches/filters → opens product detail. Register/login required to purchase.

---

## 11. Page/Route Requirements

### 11.1 Public Website

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Navbar, hero ("কৃষকের পণ্য, সরাসরি ক্রেতার কাছে"), today's daily prices, featured/latest products, categories, how it works, featured farmers, why choose us, CTA, footer. |
| `/daily-prices` | Daily Prices | Today's prices, date picker, search, category & location filters, price/unit, price-change indicator. |
| `/products` | Marketplace | Product grid, search, category/location/price-range filters, sort, availability, pagination. |
| `/products/[id]` | Product Details | Images, name, price, unit, available qty, description, category, farmer info/location, quantity selector, add-to-cart, buy. |
| `/farmers` | Farmers | List of active farmers. |
| `/farmers/[id]` | Farmer Profile | Farmer info + their active products. |
| `/about` | About | About KrishiBazar. |
| `/contact` | Contact | Contact form / info. |
| `/login` | Login | Email + password. |
| `/register` | Registration | Register as FARMER or BUYER. |

### 11.2 Farmer Area (role: FARMER)

| Route | Page |
|-------|------|
| `/farmer` | Dashboard with stats (total/active/out-of-stock products, total/pending orders, revenue). |
| `/farmer/products` | My products list + quick actions. |
| `/farmer/products/create` | Create product form. |
| `/farmer/products/[id]/edit` | Edit product form. |
| `/farmer/orders` | Orders on my products. |
| `/farmer/orders/[id]` | Order detail. |
| `/farmer/profile` | Profile management. |

### 11.3 Buyer Area (role: BUYER)

| Route | Page |
|-------|------|
| `/buyer` | Dashboard (recent orders, totals, active orders, cart summary). |
| `/buyer/cart` | Cart management. |
| `/buyer/checkout` | Checkout (address, order summary, place order). |
| `/buyer/orders` | Order history. |
| `/buyer/orders/[id]` | Order detail + tracking. |
| `/buyer/profile` | Profile management. |

### 11.4 Admin Area (role: ADMIN)

| Route | Page |
|-------|------|
| `/admin` | Dashboard with platform statistics. |
| `/admin/users` | Manage users. |
| `/admin/farmers` | Manage farmers. |
| `/admin/buyers` | Manage buyers. |
| `/admin/products` | View/manage all products. |
| `/admin/orders` | View/manage all orders. |
| `/admin/daily-prices` | Manage daily price records. |
| `/admin/categories` | Manage categories. |
| `/admin/reports` | Statistics and reports. |

### 11.5 Shared Components
Navbar (role-aware), Footer, ProductCard, PriceTable, FilterBar, Pagination, StatusBadge, QuantityStepper, EmptyState, Toasts, DashboardStatCard, Bangla text helpers.

---

## 12. Database Entity Requirements

Database values in English. All IDs are UUID strings (Prisma `@default(uuid())`). All entities include `createdAt` and `updatedAt`.

### 12.1 `User`
Shared authentication/profile record for all three roles (see Appendix A, Decision D1).

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (uuid) | PK | |
| name | String | required | |
| email | String | required, **unique** | lowercase; used for login |
| phone | String | optional, **unique** | Bangladesh format validation |
| passwordHash | String | required | bcrypt (12 rounds) |
| role | Enum `Role` | required | `ADMIN`, `FARMER`, `BUYER` |
| status | Enum `UserStatus` | default `ACTIVE` | `ACTIVE`, `INACTIVE`; inactive users cannot log in |
| location | String | optional | e.g., Sylhet |
| address | String | optional | buyer delivery address / farmer address |
| avatarUrl | String | optional | |
| createdAt / updatedAt | DateTime | auto | |

Relations: one-to-one `FarmerProfile` (optional), one-to-many `Product`, one-to-many `Cart` (1), one-to-many `Order` (buyer), many-to-many `Order` via `OrderItem` (farmer side).

### 12.2 `FarmerProfile` (optional; recommended for farmer-specific data)
| Field | Type | Notes |
|-------|------|-------|
| id | String | PK |
| userId | String | FK → User.id, **unique** |
| farmName | String | optional |
| bio | String | optional |
| ratingAvg / reviewCount | Float / Int | reserved for future ratings (Could-have) |
| verified | Boolean | default `false` — admin can mark verified (S) |

### 12.3 `Category`
| Field | Type | Notes |
|-------|------|-------|
| id | String | PK |
| name | String | required, **unique** (English slug value, e.g., `vegetable`) |
| nameBn | String | required (e.g., `সবজি`) |
| description | String | optional |
| slug | String | required, **unique** |
| isActive | Boolean | default `true` |
| createdAt / updatedAt | DateTime | |

### 12.4 `Location` (recommended for consistent filtering)
| Field | Type | Notes |
|-------|------|-------|
| id | String | PK |
| name | String | required, **unique** (English, e.g., `Sylhet`) |
| nameBn | String | required (e.g., `সিলেট`) |
| isActive | Boolean | default `true` |

Seeded with Bangladesh districts. Used by `Product.locationId` and `DailyPrice.locationId`.

### 12.5 `Product`
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String | PK | |
| farmerId | String | FK → User.id, **indexed**, restrict on delete | ownership |
| name | String | required | stored as farmer entered it (no auto-translation) |
| description | Text | optional | farmer-entered, stored as-is |
| categoryId | String | FK → Category.id, restrict on delete | |
| locationId | String | FK → Location.id | |
| price | Decimal(10,2) | required, ≥ 0 | in BDT |
| unit | Enum `Unit` | required | `KG`, `GRAM`, `LITER`, `PIECE`, `DOZEN`, `SACK` |
| quantity | Int | required, ≥ 0 | available stock |
| status | Enum `ProductStatus` | default `ACTIVE` | `ACTIVE`, `OUT_OF_STOCK`, `INACTIVE` |
| images | String[] | optional | image URLs (max ~5) |
| createdAt / updatedAt | DateTime | | |

Indexes: `(status, quantity)`, `(categoryId)`, `(locationId)`, `(farmerId)`, `(price)` for filtered/sorted queries.

**Status auto-derivation rule:** on any stock change, if `quantity <= 0` and status is `ACTIVE` → set `OUT_OF_STOCK`. Derived in service layer (not a DB trigger) for simplicity.

### 12.6 `DailyPrice`
Completely separate from `Product`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String | PK | |
| productName | String | required | e.g., Potato (as maintained by admin) |
| categoryId | String | FK → Category.id | for category filter |
| locationId | String | FK → Location.id | |
| price | Decimal(10,2) | required, ≥ 0 | BDT |
| unit | Enum `Unit` | required | |
| date | DateTime (date-only) | required | e.g., 2026-08-13 |
| createdAt / updatedAt | DateTime | | |

**Unique constraint:** `(productName, unit, date, locationId)` — one price per product per day per location.
Index: `(date)`, `(locationId)`, `(categoryId)`.

### 12.7 `Cart` & `CartItem`
| Entity | Field | Type | Notes |
|--------|-------|------|-------|
| `Cart` | id | String | PK |
| `Cart` | buyerId | String | FK → User.id, **unique**, cascade | one cart per buyer |
| `CartItem` | id | String | PK |
| `CartItem` | cartId | String | FK → Cart.id, cascade on cart delete |
| `CartItem` | productId | String | FK → Product.id |
| `CartItem` | quantity | Int | ≥ 1 |

**Unique constraint:** `(cartId, productId)` — one line per product in a cart. `unitPrice` intentionally NOT stored in cart (always read current price; snapshot happens at order time).

### 12.8 `Order`
| Field | Type | Notes |
|-------|------|-------|
| id | String | PK |
| orderNumber | String | required, **unique** — human-readable (e.g., `KB-<timestamp>`) |
| buyerId | String | FK → User.id, indexed, restrict |
| status | Enum `OrderStatus` | see §16 |
| totalAmount | Decimal(10,2) | snapshot sum of order items at order time |
| shippingAddress | String | required snapshot at order time |
| phone | String | required snapshot |
| note | String | optional |
| paymentMethod | Enum `PaymentMethod` | required at checkout |
| paymentStatus | Enum `PaymentStatus` | derived/denormalized from Payment, default `PENDING` |
| placedAt / createdAt / updatedAt | DateTime | |

### 12.9 `OrderItem`
| Field | Type | Notes |
|-------|------|-------|
| id | String | PK |
| orderId | String | FK → Order.id, **cascade** on order delete |
| productId | String | FK → Product.id (kept for reference; restrict) |
| farmerId | String | FK → User.id, **indexed** — denormalized for fast farmer order lookup |
| productName | String | **snapshot** at purchase time (price history preserved even if product renamed) |
| quantity | Int | > 0 |
| unitPrice | Decimal(10,2) | **snapshot** at purchase time |
| lineTotal | Decimal(10,2) | quantity × unitPrice |
| unit | Enum `Unit` | snapshot |

### 12.10 `Payment`
| Field | Type | Notes |
|-------|------|-------|
| id | String | PK |
| orderId | String | FK → Order.id, **unique** (one payment per order) |
| method | Enum `PaymentMethod` | `COD`, `BKASH`, `STRIPE` (COD only in launch scope) |
| status | Enum `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| amount | Decimal(10,2) | = order.totalAmount |
| transactionId | String | optional — gateway reference |
| gatewayPayload | Json | optional — raw gateway/webhook response for future gateways |
| paidAt | DateTime | optional |
| createdAt / updatedAt | DateTime | |

### 12.11 Enums (DB, English only)

```ts
Role            { ADMIN, FARMER, BUYER }
UserStatus      { ACTIVE, INACTIVE }
ProductStatus   { ACTIVE, OUT_OF_STOCK, INACTIVE }
OrderStatus     { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED }
PaymentMethod   { COD, BKASH, STRIPE }
PaymentStatus   { PENDING, PAID, FAILED, REFUNDED }
Unit            { KG, GRAM, LITER, PIECE, DOZEN, SACK }
```

### 12.12 Deletion/Cascade Strategy
| Relationship | On delete behavior | Rationale |
|--------------|--------------------|-----------|
| Cart → CartItem | CASCADE | cart items meaningless without cart |
| Order → OrderItem | CASCADE | order items belong to order |
| User → Cart | CASCADE | one cart per buyer |
| User → Product | RESTRICT | prevent deleting farmer with products; admin deactivates instead |
| User → Order | RESTRICT | keep audit trail |
| Category → Product / DailyPrice | RESTRICT | prevent orphaned products |
| Product → OrderItem | RESTRICT | keep order history referentially intact |
| Location → Product / DailyPrice | RESTRICT | |

---

## 13. Entity Relationships

```
User (1) ──1:1── (0..1) FarmerProfile
User (buyer) (1) ──1:1── (1) Cart
Cart (1) ──1:N── CartItem
CartItem (N) ──N:1── Product
User (farmer) (1) ──1:N── Product
Product (1) ──N:1── Category
Product (1) ──N:1── Location
User (buyer) (1) ──1:N── Order
Order (1) ──1:N── OrderItem
OrderItem (N) ──N:1── Product
OrderItem (N) ──N:1── User (farmer)     -- denormalized farmerId
Order (1) ──1:1── Payment
DailyPrice (N) ──N:1── Category
DailyPrice (N) ──N:1── Location
```

**Key relationship notes:**
- One checkout creates **one Order per farmer** whose products are in the cart (see Appendix A, Decision D3). Each Order references one buyer and contains items only from one farmer. This keeps the farmer→order status update clean and matches "farmers manage orders related to their products."
- `OrderItem.farmerId` is denormalized for fast farmer order queries and to preserve attribution even if a product is later deleted.
- `DailyPrice` shares `Category`, `Location`, and `Unit` but is otherwise completely independent of `Product`.

---

## 14. API Requirements

**Conventions:**
- Base URL: `/api/v1`
- Success: `{ success: true, message, data }`
- Error: `{ success: false, message, errors? }`
- Auth: `Set-Cookie` HttpOnly JWT cookie named `kb_access_token` (or `Authorization: Bearer` for non-browser clients).
- Pagination params: `page` (default 1), `limit` (default 20, max 100). Response: `{ data, meta: { page, limit, total, totalPages } }`.

### 14.1 Auth

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| POST | `/auth/register` | Public | — | Register FARMER or BUYER | `{ name, email, phone, password, role, location? }` | 201 created user (no token) |
| POST | `/auth/login` | Public | — | Login, set HttpOnly cookie | `{ email, password }` | 200 user + cookie |
| POST | `/auth/logout` | Auth | all | Clear cookie | — | 200 ok |
| GET | `/auth/me` | Auth | all | Current user | — | 200 user + profile |

### 14.2 Users / Profiles

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/users/me` | Auth | all | Own profile (includes role-specific profile) | — | 200 |
| PUT | `/users/me` | Auth | all | Update own profile | `{ name?, phone?, location?, address?, avatarUrl? }` | 200 |
| PUT | `/users/me/password` | Auth | all | Change password | `{ currentPassword, newPassword }` | 200 |
| GET | `/users/me/orders` | Auth | BUYER | Buyer's orders | `?status&page&limit` | 200 list |

### 14.3 Categories

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/categories` | Public | — | List active categories | — | 200 |
| GET | `/categories/:id` | Public | — | Category detail | — | 200 |
| POST | `/admin/categories` | Auth | ADMIN | Create | `{ name, nameBn, slug }` | 201 |
| PUT | `/admin/categories/:id` | Auth | ADMIN | Update | same | 200 |
| PATCH | `/admin/categories/:id/status` | Auth | ADMIN | Activate/deactivate | `{ isActive }` | 200 |

### 14.4 Daily Prices

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/daily-prices` | Public | — | Browse prices | `?date&categoryId&locationId&search&page&limit` | 200 paged list (+ optional change indicator) |
| GET | `/daily-prices/today` | Public | — | Today's prices | `?categoryId&locationId` | 200 list |
| GET | `/locations` | Public | — | Locations for filters | — | 200 |
| POST | `/admin/daily-prices` | Auth | ADMIN | Create (single or bulk array) | `[{ productName, categoryId, locationId, price, unit, date }]` | 201 |
| PUT | `/admin/daily-prices/:id` | Auth | ADMIN | Update | same fields | 200 |
| DELETE | `/admin/daily-prices/:id` | Auth | ADMIN | Delete | — | 200 |

### 14.5 Products (Buyer marketplace)

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/products` | Public | — | Marketplace listing (only ACTIVE + stock > 0) | `?search&categoryId&locationId&minPrice&maxPrice&sort&page&limit` | 200 paged list |
| GET | `/products/:id` | Public | — | Detail incl. farmer info | — | 200 |

Sort options: `newest` (default), `price_asc`, `price_desc`, `name`, `stock`.

### 14.6 Farmers (public)

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/farmers` | Public | — | List farmers with products | `?search&locationId&page&limit` | 200 |
| GET | `/farmers/:id` | Public | — | Farmer profile + active products | — | 200 |

### 14.7 Farmer product management

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/farmer/products` | Auth | FARMER | Own products | `?status&page&limit` | 200 |
| POST | `/farmer/products` | Auth | FARMER | Create (→ ACTIVE) | `{ name, description, categoryId, locationId, price, unit, quantity, images }` | 201 |
| PUT | `/farmer/products/:id` | Auth | FARMER (owner) | Edit own | same | 200 |
| DELETE | `/farmer/products/:id` | Auth | FARMER (owner) | Delete own | — | 200 (soft: sets INACTIVE, or hard delete if no orders) |
| PATCH | `/farmer/products/:id/stock` | Auth | FARMER (owner) | Restock | `{ addQuantity }` | 200 (recomputes status) |
| PATCH | `/farmer/products/:id/status` | Auth | FARMER (owner) | Activate/deactivate | `{ status: ACTIVE \| INACTIVE }` | 200 |

### 14.8 Cart

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/cart` | Auth | BUYER | Get cart + items + subtotal | — | 200 |
| POST | `/cart/items` | Auth | BUYER | Add item | `{ productId, quantity }` | 201 (or 200 if exists) |
| PUT | `/cart/items/:id` | Auth | BUYER (owner) | Update quantity | `{ quantity }` | 200 |
| DELETE | `/cart/items/:id` | Auth | BUYER (owner) | Remove item | — | 200 |
| DELETE | `/cart` | Auth | BUYER | Clear cart | — | 200 |

### 14.9 Orders

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| POST | `/orders` | Auth | BUYER | Checkout cart → creates orders (one per farmer) | `{ shippingAddress, phone, note?, paymentMethod }` | 201 `{ orders: [...] }` |
| GET | `/orders` | Auth | BUYER | Own order history | `?status&page&limit` | 200 |
| GET | `/orders/:id` | Auth | BUYER (owner) | Own order detail | — | 200 |
| GET | `/farmer/orders` | Auth | FARMER | Orders containing own products | `?status&page&limit` | 200 |
| GET | `/farmer/orders/:id` | Auth | FARMER (involved) | Order detail | — | 200 |
| PATCH | `/farmer/orders/:id/status` | Auth | FARMER (involved) | Update status | `{ status }` | 200 |

Allowed farmer status transitions: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`; `PENDING/CONFIRMED → CANCELLED`. Admin may use the same transitions via admin endpoints.

### 14.10 Payments (launch: COD only)

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| POST | `/orders/:id/payment` | Auth | BUYER (owner) | Confirm payment intent (COD = mark due) | `{ method }` | 201 |
| GET | `/orders/:id/payment` | Auth | BUYER (owner) | Payment status | — | 200 |
| POST | `/payments/webhook/:provider` | Webhook | internal | Reserved for bKash/Stripe webhooks | gateway payload | 200 |

### 14.11 Admin

| Method | Endpoint | Auth | Roles | Purpose | Body / Query | Response |
|--------|----------|------|-------|---------|--------------|----------|
| GET | `/admin/dashboard` | Auth | ADMIN | Platform stats | — | 200 |
| GET | `/admin/users` | Auth | ADMIN | List users | `?role&status&search&page&limit` | 200 |
| GET | `/admin/users/:id` | Auth | ADMIN | User detail | — | 200 |
| PATCH | `/admin/users/:id/status` | Auth | ADMIN | Activate/deactivate | `{ status }` | 200 |
| PATCH | `/admin/users/:id/role` | Auth | ADMIN | Change role (not self) | `{ role }` | 200 |
| GET | `/admin/farmers` | Auth | ADMIN | List farmers | `?status&search` | 200 |
| GET | `/admin/buyers` | Auth | ADMIN | List buyers | `?search` | 200 |
| GET | `/admin/products` | Auth | ADMIN | All products | `?status&search&farmerId` | 200 |
| PATCH | `/admin/products/:id/status` | Auth | ADMIN | Deactivate/activate any product | `{ status }` | 200 |
| GET | `/admin/orders` | Auth | ADMIN | All orders | `?status&page&limit` | 200 |
| GET | `/admin/orders/:id` | Auth | ADMIN | Order detail | — | 200 |
| PATCH | `/admin/orders/:id/status` | Auth | ADMIN | Update status | `{ status }` | 200 |
| GET | `/admin/reports` | Auth | ADMIN | Aggregates (sales by period, top products, top farmers) | `?from&to` | 200 |

---

## 15. Authentication & Authorization

### 15.1 Token Strategy
- **JWT access token** stored in an **HttpOnly, SameSite=Lax, Secure (prod)** cookie named `kb_access_token`.
- Token payload: `{ sub: userId, role }`. Expiry: 7 days (portfolio scope; can add refresh tokens later — see §26).
- **Never** stored in `localStorage`/`sessionStorage` (XSS risk).
- Logout = clear cookie server-side.
- For non-browser/API clients, optionally also accept `Authorization: Bearer <token>` (same cookie verified first).

### 15.2 Flow
```
Register → Login → verify bcrypt → sign JWT → Set-Cookie → client stores nothing
Every request → cookie sent → authMiddleware verifies JWT → req.user = { id, role }
route.use(requireRole(ROLE)) → 403 if role mismatch
```

### 15.3 Middleware
1. `authenticate` — verify JWT; attach `req.user`; 401 if missing/invalid/expired.
2. `requireRole(...roles)` — 403 if user role not allowed.
3. `isProductOwner` / `isOrderParticipant` / `isResourceOwner` — ownership checks (BR-06, BR-07, BR-08).
4. `validate(ZodSchema)` — parses/validates body/query/params; 400 with `errors`.

### 15.4 Password Hashing
- `bcrypt` (cost 12). Never store plain text. `currentPassword` verified before any password change.

---

## 16. Order & Stock Logic

### 16.1 Status Model (analysis)
Suggested: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`, plus `CANCELLED`.

**Recommendation:** keep all six. `CONFIRMED` = farmer accepts; `PROCESSING` = packing; `SHIPPED` = handed to delivery; `DELIVERED` = buyer confirms receipt. `CANCELLED` by farmer (before shipping) or buyer (before confirmation). For a portfolio, these six statuses clearly demonstrate a full workflow without being excessive. If simplification is desired, `CONFIRMED` and `PROCESSING` may be merged — flagged as optional.

### 16.2 Checkout Transaction (Prisma `$transaction`)

Because Express runs a single-threaded Node process but the DB is the source of truth, safety is guaranteed by **atomic conditional updates** inside a transaction:

1. **Lock & validate** — for each cart item: read product with `SELECT ... FOR UPDATE` (interactive transaction).
2. **Check** product.status === `ACTIVE` and `quantity >= requested`.
3. **Decrement** stock atomically:
   ```sql
   UPDATE product
   SET quantity = quantity - $requested,
       status = CASE WHEN (quantity - $requested) <= 0 THEN 'OUT_OF_STOCK' ELSE status END
   WHERE id = $productId AND quantity >= $requested AND status = 'ACTIVE'
   ```
   If `rowCount === 0` → abort transaction (insufficient stock or product inactive) → 409.
4. **Create Orders** — group items by farmer; create one `Order` per farmer + their `OrderItem`s with **price/productName/unit snapshots**; compute `totalAmount`.
5. **Create `Payment`** row (PENDING) per order (COD scope).
6. **Clear cart** items.
7. **Commit.** Any failure → rollback → cart unchanged, stock unchanged.

### 16.3 Overselling protection
- The conditional `WHERE quantity >= $requested` update makes over-sell impossible even under concurrency.
- Cart quantity is always capped to current stock; re-validated at checkout (stock may have changed).

### 16.4 Price snapshot
`OrderItem.unitPrice` and `productName` are copied from the product at checkout time. Historical orders are immutable against future price/name changes (BR-12).

---

## 17. Daily Price System

- **Separate entity** from `Product` — different data, different admin flows, different lifecycle. No merging.
- One record = product name + price + unit + date + location (+ category for filtering).
- **Unique** per `(productName, unit, date, locationId)` → prevents duplicate same-day entries for the same item+place.
- Public page `/daily-prices`:
  - Default: today's records.
  - Date picker to browse previous days.
  - Search by product name; filters by category and location.
  - Each row: product name (Bangla display via mapping if available, else raw admin text), price, unit, date, location, and optional ▲/▼ change vs previous record for the same product+location (computed by comparing to the latest record with `date < current.date`).
- Admin CRUD at `/admin/daily-prices`, with bulk entry support for quick daily updates.
- **Display guidance:** admin enters product names (English or Bangla) as-is. UI can attempt a display mapping to Bangla where a `Category`-based label exists; raw text is preserved (never auto-translated, per BR-11).

---

## 18. Cart System

**Decision: persistent (database-backed) cart.** Rationale:
- Works across devices/sessions; buyer can return later.
- Stock re-validation at checkout is straightforward server-side.
- Subtotal computed server-side (authoritative).
- Portfolio-level effort is minimal (two tables + 5 endpoints).

Design: one `Cart` per buyer (unique `buyerId`), `CartItem` rows with unique `(cartId, productId)`. No price snapshot in cart — current price read live; snapshot applied at order time only.

Rules:
- `quantity` must be ≥ 1 and ≤ product stock.
- Adding an existing product increments quantity (capped at stock).
- Adding an inactive/out-of-stock product → 400/409.
- At checkout, every line is re-validated inside the transaction.

---

## 19. Payment Architecture

**Launch scope:** Cash on Delivery (COD) only. No gateway integration.

- `Payment` (1:1 with `Order`): stores `method`, `status`, `amount`, `transactionId`, `gatewayPayload` (JSON), `paidAt`.
- On COD order placement → `Payment{ method: COD, status: PENDING }`; farmer marks `DELIVERED` → optionally `PAID`.
- **Future bKash / Stripe:** add gateway-agnostic design now:
  - `method` enum extended (`BKASH`, `STRIPE`).
  - `transactionId` + `gatewayPayload` capture gateway responses.
  - Reserved webhook endpoint `POST /payments/webhook/:provider` to update payment/order status out-of-band.
  - Payment status governs order progression: `PAID` required before `SHIPPED` for non-COD.
- No money handling in the core app; gateways manage funds.

---

## 20. Frontend Requirements

### 20.1 Stack
- **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4**.
- **TanStack Query** — server state, caching, invalidation, mutations.
- **React Hook Form** + **Zod** (resolver) — form state and validation.
- Component/UI system: **shadcn/ui** (Radix-based) is recommended for production-quality components with Tailwind; alternatively Headless UI. Use a consistent design system (colors, typography, spacing).
- **Bangla-first UI** with a `labels` mapping module (see Appendix B). Font: Hind Siliguri / Noto Sans Bengali via `next/font`.

### 20.2 Key Implementation Points
- Server Components for public read-heavy pages (home, daily prices, products) → SEO + speed; Client Components for interactive areas (cart, filters, forms) with TanStack Query.
- Route groups: `(public)`, `(farmer)`, `(buyer)`, `(admin)` with layout-level auth guards.
- API layer: typed fetch wrapper with credentials (`include`) for cookie auth; `lib/api.ts`.
- Server-side env: `NEXT_PUBLIC_API_URL` for client calls, `API_URL` for server calls.
- Zod schemas shared between client forms and server validation (duplicate or via a shared package — see §26).

### 20.3 Responsive Strategy
- Mobile-first Tailwind breakpoints; mobile nav drawer; cards stack on mobile, grids (2/3/4 cols) on tablet/desktop; tables collapse to cards on mobile (esp. admin/order tables).

---

## 21. Backend Requirements

### 21.1 Stack
- **Node.js + Express 5 + TypeScript**, REST API, separate from frontend.
- **Prisma 7** + PostgreSQL.
- Middleware chain: `helmet` → `cors(credentials)` → `express.json()` → request logging → routes → centralized error handler.
- `express-rate-limit` for brute-force/abuse protection; `cookie-parser` for HttpOnly cookies.

### 21.2 Layered Architecture
```
src/
  config/        env, constants
  lib/           prisma client, logger
  middlewares/   auth, requireRole, validate, ownership, errorHandler, notFound
  utils/         ApiResponse, ApiError, asyncHandler, jwt, bcrypt
  schemas/       zod schemas (auth, user, product, dailyPrice, cart, order, admin)
  services/      business logic (orders use $transaction), prisma calls
  controllers/   parse/validate + delegate to services + respond
  routes/        v1/index.ts + resource routers
  types/         express.d.ts (req.user augmentation), api types
  app.ts         express bootstrap
  server.ts      entry
```

### 21.3 Conventions
- Controllers stay thin; all business logic in services.
- Async handlers wrapped (`asyncHandler`) → errors flow to central error handler.
- Versioned API under `/api/v1`.
- Consistent response envelope `{ success, message, data }` (see §23).
- Secrets in `.env`, validated at boot.

---

## 22. Security Requirements

| Area | Requirement |
|------|-------------|
| **Authentication** | JWT in HttpOnly cookie (`SameSite=Lax`, `Secure` in prod); short-ish expiry (7d); no localStorage storage. |
| **Passwords** | bcrypt cost 12; `currentPassword` required for changes; never log passwords. |
| **Authorization** | Role middleware; **ownership checks** on every resource (farmer↔product, buyer↔order/cart). |
| **Validation** | Zod on all inputs (body/query/params); reject unknown fields; cap string lengths; enum whitelists. |
| **CORS** | Restrict origins to the frontend origin(s); `credentials: true`. |
| **Rate limiting** | `express-rate-limit`: strict on `/auth/login` & `/auth/register` (e.g., 5–10/min per IP); general API limit (e.g., 100/min). |
| **Headers** | `helmet` (CSP, X-Frame-Options, nosniff, etc.). |
| **Injection** | Prisma parameterization; never raw SQL except the guarded stock update; no string-concatenated queries. |
| **Data exposure** | Never return `passwordHash`; admin-only endpoints return internal data; serializers shape responses. |
| **Cookie/auth edge** | Logout clears cookie; deactivated users blocked at login and middleware (check user status on protected routes). |
| **Uploads** | (If images) validate type/size, store outside `public`, serve via signed/safe route; or use Cloudinary. |
| **Ownership checks** | Farmer cannot edit/delete others' products by changing `:id`; buyer cannot read others' orders; farmer cannot update orders not containing their products. |

---

## 23. Error Handling

**Envelope (success):**
```json
{ "success": true, "message": "OK", "data": { ... } }
```

**Envelope (error):**
```json
{ "success": false, "message": "Insufficient stock", "errors": [ { "field": "quantity", "message": "Only 5 kg available" } ] }
```

**Status code map:**

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | read/update |
| 201 | Created | create |
| 204 | No content | delete (optional) |
| 400 | Bad request | validation failures |
| 401 | Unauthorized | missing/invalid/expired token |
| 403 | Forbidden | wrong role / not owner |
| 404 | Not found | resource missing |
| 409 | Conflict | stock insufficient, duplicate daily price, duplicate email |
| 422 | Unprocessable | semantic validation (stock > available) |
| 429 | Too many requests | rate limited |
| 500 | Internal | unexpected (logged, generic message) |

Central error handler: maps known `ApiError` instances and Zod errors to the envelope; logs unexpected errors; never leaks stack traces to clients.

---

## 24. Search / Filter / Pagination

All built on PostgreSQL via Prisma queries with appropriate indexes.

### 24.1 Products
- **Search:** `ILIKE` on `name` and `description` (case-insensitive). Note: Bangla text in `ILIKE` works since PG stores UTF-8; prefix/trigram index (`pg_trgm`) is a future optimization.
- **Category / location:** equality on `categoryId`, `locationId`.
- **Price range:** `price >= minPrice AND price <= maxPrice`.
- **Availability:** implicit — only `status = ACTIVE` and `quantity > 0` for marketplace.
- **Sort:** `createdAt DESC` (newest), `price ASC/DESC`, `name ASC`; whitelist to avoid arbitrary ORDER BY injection.
- **Pagination:** `offset/limit` at this scale (simple); note in §26 that cursor pagination is the scale-up path.
- **Count:** parallel `count` for `total`.

### 24.2 Daily Prices
- **Date:** exact date filter; "today" default.
- **Search:** `ILIKE` on `productName`.
- **Category / location:** equality filters.
- **Change indicator:** for each row, subquery for previous record `(productName, unit, locationId, date < current)` ordered desc, take 1; compare prices. Compute in service; keep N+1 bounded via batch lookup.

### 24.3 Indexes to support these
`Product(status, quantity)`, `Product(categoryId)`, `Product(locationId)`, `Product(price)`, `Product(farmerId)`, `DailyPrice(date)`, `DailyPrice(locationId)`, `DailyPrice(categoryId)`, unique `DailyPrice(productName, unit, date, locationId)`.

---

## 25. Recommended Project Architecture

```
KrishiBazar/
├── krishibazar-client/            # Frontend (Next.js 16, App Router)
│   ├── app/
│   │   ├── (public)/              # home, products, daily-prices, farmers, about, contact, login, register
│   │   ├── (farmer)/              # farmer/* guarded layouts
│   │   ├── (buyer)/               # buyer/*
│   │   ├── (admin)/               # admin/*
│   │   ├── layout.tsx             # root layout, fonts, providers
│   │   └── globals.css
│   ├── components/                # ui/ (shadcn), shared, forms, dashboard
│   ├── lib/                       # api.ts, queryClient, auth helpers
│   ├── hooks/                     # TanStack Query hooks
│   ├── stores/ (optional)         # lightweight client state (cart drawer open)
│   └── middleware.ts              # Next.js route protection (optional)
│
└── KrishiBazar-server/            # Backend (Express 5 + Prisma)
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts                # admin user, categories, locations, sample daily prices
    ├── src/
    │   ├── config/  lib/  middlewares/  utils/  schemas/
    │   ├── services/  controllers/  routes/  types/
    │   ├── app.ts
    │   └── server.ts
    └── .env
```

- Frontend and backend are **completely separate** apps with their own package.json, build, and deploy.
- Frontend talks to backend only over HTTP REST.
- Env vars: backend `.env` (DATABASE_URL, JWT_SECRET, COOKIE_SECURE, CORS_ORIGIN, PORT); frontend `.env.local` (NEXT_PUBLIC_API_URL).
- Seed script creates: default ADMIN, sample categories, Bangladesh locations, a few sample farmers/products/daily prices for demo.

---

## 26. Future Scalability Considerations

| Area | Future direction |
|------|------------------|
| **Auth** | Access + refresh token rotation; token blacklist/revocation; phone OTP login (common in BD agri apps). |
| **Cart** | Guest cart merge into buyer cart on login. |
| **Orders** | Cursor pagination; per-item status if multi-status tracking becomes needed. |
| **Search** | `pg_trgm` GIN index for Bangla ILIKE; later dedicated search (Meilisearch/OpenSearch) or Postgres full-text. |
| **Images** | Cloudinary/S3 uploads; image optimization via Next `<Image>`. |
| **Payments** | Activate bKash/Stripe via `method` enum + webhooks; escrow/confirmation flows. |
| **Notifications** | SMS (Bangladesh-friendly, e.g., via Twilio/BulkSMS) and email on order events; real-time status via SSE/WebSocket or polling. |
| **Multi-vendor reports** | Aggregated sales analytics with time-series tables. |
| **Shared types** | A shared `@krishibazar/shared` package for Zod schemas & TS types between FE/BE to avoid drift. |
| **Deployment** | Docker compose (web, api, db); Vercel (FE) + Render/Railway/VPS (BE + PG); Redis for rate limiting at scale. |
| **Rated moderation** | Farmer ratings/reviews; admin verification badge (already reserved in `FarmerProfile`). |

---

## 27. Development Phases / Implementation Roadmap

### Phase 1 — Foundations (Setup & Auth)
- Monorepo layout, env, seed script (admin, categories, locations).
- Prisma schema: User, FarmerProfile, Category, Location, enums.
- Backend: error handling, response envelope, auth (register/login/logout/me), JWT cookie, bcrypt, role middleware, rate limiting.
- Frontend: Tailwind + shadcn/ui, Bangla label system, fonts, login/register pages, auth provider + route guards, layout shell.

### Phase 2 — Marketplace Core
- Prisma: Product (+ status rules), DailyPrice, indexes.
- Backend: categories, locations, public products listing/filter/sort, product detail, farmer product CRUD + restock/status, daily-price CRUD + public browse.
- Frontend: home page sections, products grid + filters + pagination, product detail, farmer dashboard + product management, daily-prices page, public farmers pages.

### Phase 3 — Commerce (Cart, Orders, Payments)
- Prisma: Cart, CartItem, Order, OrderItem, Payment.
- Backend: cart endpoints, checkout transaction with atomic stock decrement + snapshots, order status endpoints (buyer + farmer + admin), COD payment rows, admin dashboard/reports.
- Frontend: cart, checkout, buyer orders/tracking, farmer orders, buyer/farmer dashboards, admin area (users, farmers, buyers, products, orders, daily-prices, categories, reports).

### Phase 4 — Polish & Hardening
- Contact/about pages, contact form (could-have: mailto/API).
- Empty states, toasts, loading skeletons, mobile responsiveness pass.
- Security pass (ownership tests, rate limits, helmet), error-handling audit.
- Seed realistic demo data; README; optional Docker compose.

### Phase 5 — Future
- bKash/Stripe via Payment extension + webhooks.
- Farmer ratings, SMS notifications, guest cart, advanced analytics.

---

## Appendix A — Identified Ambiguities & Recommendations

| # | Ambiguity / Issue | Recommendation |
|---|-------------------|----------------|
| D1 | Should `FarmerProfile`/`BuyerProfile` be separate tables? | Use a **unified `User`** table for shared fields (name, email, phone, password, role, status, location, address). Add an optional `FarmerProfile` for farmer-only data (farmName, bio, verified). No `BuyerProfile` needed — buyer address lives on `User.address` (+ order-level snapshot). Simpler, normalized, practical. |
| D2 | Units & currency scope | Define a fixed `Unit` enum (`KG, GRAM, LITER, PIECE, DOZEN, SACK`) and use BDT exclusively (৳). Extending units later is a small enum change. |
| D3 | One checkout with items from multiple farmers — how do farmers manage "their" orders? | **Create one Order per farmer** at checkout (group cart lines by farmer). Each order's items all belong to one farmer, so farmer status updates are unambiguous. Buyer's order history lists all their orders. Avoids per-item status complexity. (Optional future: parent `CheckoutGroup` to group a single payment across farmer orders.) |
| D4 | `CONFIRMED` vs `PROCESSING` overlap | Keep all six statuses for a complete portfolio demo; merge `CONFIRMED` into `PROCESSING` if simplification is preferred. |
| D5 | Farmer registration approval? | Self-registration; ADMIN can deactivate users. **No** farmer approval gate at launch. `FarmerProfile.verified` reserved for a future verified badge. |
| D6 | Product "delete" semantics | If a product has order history, prefer **soft delete** (set `INACTIVE`, keep rows) to preserve `OrderItem` references and farmer attribution. Hard delete only when no orders exist. |
| D7 | Cart as DB vs localStorage | **DB-backed cart** (persistent, authoritative stock checks). See §18. |
| D8 | Image storage | Keep simple: local `/uploads` served by backend with validation, or Cloudinary. Do not block core build on images — make images optional. |
| D9 | Bangla product names in search/filters | Farmer-entered names stored verbatim (BR-11). For daily prices, admin may enter Bangla names; ILIKE search works for both. No auto-translation anywhere. |
| D10 | Price-change indicator data availability | Computed on-the-fly from previous records for same (productName, unit, locationId). If no previous record, omit indicator. |
| D11 | JWT expiry / refresh | 7-day single token is fine for portfolio; add refresh-token rotation later (see §26). |
| D12 | Shared Zod schemas FE/BE | Start by duplicating schemas per app; extract a shared package in Phase 5. |
| D13 | `orderNumber` format | `KB-20260813-XXXX` human-readable unique string for buyer/CS reference. |

---

## Appendix B — Bangla UI Label Mapping

DB/code values are English; the frontend maps them to Bangla via a labels module (e.g., `lib/labels.ts` with `ROLE`, `PRODUCT_STATUS`, `ORDER_STATUS`, `UNIT`, `NAV`, `COMMON` maps + a `t(key)` helper).

| English (DB/Code) | Bangla (UI) |
|-------------------|-------------|
| KrishiBazar | কৃষিবাজার |
| Admin | অ্যাডমিন |
| Farmer | কৃষক |
| Buyer | ক্রেতা |
| Product | পণ্য |
| Products | পণ্যসমূহ |
| Order | অর্ডার |
| Orders | অর্ডারসমূহ |
| Daily Prices | দৈনিক বাজারদর |
| Today's Prices | আজকের বাজারদর |
| Add Product | পণ্য যোগ করুন |
| My Products | আমার পণ্য |
| Active / Published | প্রকাশিত |
| Out of Stock | স্টক শেষ |
| Inactive | নিষ্ক্রিয় |
| Home | হোম |
| About | আমাদের সম্পর্কে |
| Contact | যোগাযোগ |
| Login | লগইন |
| Register | নিবন্ধন |
| Cart | কার্ট |
| Checkout | চেকআউট / কেনাকাটা সম্পন্ন করুন |
| Farmer Profile | কৃষকের প্রোফাইল |
| Price | দাম |
| Quantity | পরিমাণ |
| Category | ক্যাটাগরি |
| Location | এলাকা |
| Search | খুঁজুন |
| Sort | সাজান |
| Filter | ফিল্টার |
| Add to Cart | কার্টে যোগ করুন |
| Place Order | অর্ডার করুন |
| Order History | অর্ডার ইতিহাস |
| Track Order | অর্ডার ট্র্যাক করুন |
| Pending | অপেক্ষমাণ |
| Confirmed | নিশ্চিতকৃত |
| Processing | প্রক্রিয়াধীন |
| Shipped | পণ্য পাঠানো হয়েছে |
| Delivered | ডেলিভারি সম্পন্ন |
| Cancelled | বাতিল |
| Cash on Delivery | ক্যাশ অন ডেলিভারি |
| Dashboard | ড্যাশবোর্ড |
| Sales / Revenue | বিক্রয় / আয় |
| Unit | একক |
| KG | কেজি |
| GRAM | গ্রাম |
| LITER | লিটার |
| PIECE | পিস |
| DOZEN | ডজন |
| SACK | বস্তা |
| Hero tagline | কৃষকের পণ্য, সরাসরি ক্রেতার কাছে |

---

*End of SRS v1.0.*
