# ⚙️ QR Monitor Backend
 
A scalable, production-ready backend built with **Express.js**, **TypeScript**, and **PostgreSQL** using **Prisma ORM**. It provides the core API logic for QR code generation, tracking, and user management.

----------

### 🚀 Features

- ✅ **Express.js** for high-performance routing & middleware
- ✅ **TypeScript** for robust, type-safe development
- ✅ **Prisma ORM** for seamless PostgreSQL interaction
- ✅ **JWT Authentication** (Login/Register/Session management)
- ✅ **Device Detection** integrating `node-device-detector`
- ✅ **Swagger (OpenAPI)** documentation for easy API exploration
- ✅ **Winston Logger** with daily rotating file + console transports
- ✅ **Modular Architecture** optimized for scalability
- ✅ **Secure** using Helmet and Express Rate Limit

----------

### 📁 Folder Structure

```
/src
 ├── config/         # Environment, logger, DB configuration
 ├── controllers/    # Route handler logic
 ├── middlewares/    # Auth, error, and request logging
 ├── routes/         # API route definitions
 ├── services/       # Core business logic
 ├── prisma/         # Prisma schema and database migrations
 ├── utils/          # Shared helper functions (hashing, JWT)
 ├── docs/           # Swagger documentation config
 ├── types/          # Custom TypeScript interfaces
 ├── app.ts          # Express application setup
 └── server.ts       # Application entry point
```

----------

### 🛠️ Getting Started

#### Prerequisites
- Node.js (v18+)
- PostgreSQL database

#### Installation
1. Navigate to the backend directory:
   ```bash
   cd qrcodeproject/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.development
   ```
   Fill in your database URL and JWT secret in `.env.development`.

4. Initialize Database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

#### Running Locally
```bash
npm run dev
```

----------

### 📘 API Documentation

- **Swagger UI:** accessible at `http://localhost:<PORT>/docs` (Default port: 8080 or as per `.env`)

----------

### 📁 Versioning
Current Version: **1.0.0**

----------

### 📝 Changelog

#### [1.0.0] - 2026-01-16
- **Initial Release:** Initial production-ready release of QR Monitor Backend.
- **Security:** Implemented application-level security reinforcements and JWT authentication.
- **Validation:** Added schema-level validation for all API endpoints.
- **Improved:** Enhanced scan tracking accuracy and data collection.
- **Environment:** Configured multi-environment support (development, staging, production).
- **Communication:** Added contact endpoint and refined SendGrid email templates.
- **Payment:** Integrated payment request routing and processing.
- **Tracking:** Improved mobile device detection and location mapping accuracy.
- **Refactor:** Standardized error handling and modularized services.
- **Database:** Optimized Prisma schemas and established efficient indexing for scan data.
- **Docs:** Fully integrated Swagger (OpenAPI) documentation at `/docs`.
- **Misc:** Created `.env.example` file for easier deployment and setup.
