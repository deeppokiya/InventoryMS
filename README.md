# 📦 Inventory Management System

Full-stack inventory management app built with **Angular 17**, **ASP.NET Core 8**, **PostgreSQL**, and **Docker**.

---

## 🚀 Quick Start with Docker (Recommended)

```bash
# Clone or extract the project
cd InventoryMS

# Start everything with one command
docker-compose up --build

# Access:
# Frontend:  http://localhost:4200
# Backend API: http://localhost:5000
# Swagger UI:  http://localhost:5000/swagger
```

### Default Credentials
| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@inventory.com    | Admin@123!  |
| Staff | staff@inventory.com    | Staff@123!  |

---

## 🛠️ Manual Setup

### Backend (ASP.NET Core)

**Prerequisites:** .NET 8 SDK, PostgreSQL

```bash
cd backend

# Update connection string in appsettings.json
# "Host=localhost;Port=5432;Database=inventorydb;Username=postgres;Password=yourpassword"

# Run migrations and start
dotnet ef database update
dotnet run
# API runs on http://localhost:5000
```

### Frontend (Angular)

**Prerequisites:** Node.js 18+, Angular CLI

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
# App runs on http://localhost:4200
```

---

## 📁 Project Structure

```
InventoryMS/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs         # Login, Register
│   │   ├── ProductController.cs      # CRUD + Pagination + Search
│   │   ├── AdminStaffController.cs   # Staff Management (Admin only)
│   │   └── AdminReportsController.cs # Reports (Admin only)
│   ├── Models/
│   │   ├── ApplicationUser.cs
│   │   └── Product.cs
│   ├── DTOs/DTOs.cs
│   ├── Data/
│   │   ├── InventoryContext.cs
│   │   └── IdentitySeed.cs           # Seeds Admin + Staff users
│   ├── Program.cs
│   ├── appsettings.json
│   └── Dockerfile
│
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── login/                # Login page
│       │   ├── dashboard/            # Summary cards, recent products
│       │   ├── product-list/         # Table + search + filter + pagination
│       │   ├── add-product/          # Create product form
│       │   ├── edit-product/         # Edit product form
│       │   ├── staff-management/     # Admin: add/remove staff
│       │   ├── reports/              # Admin: low stock, category charts
│       │   └── shared/
│       │       ├── navbar/
│       │       └── sidebar/
│       ├── services/
│       │   ├── auth.service.ts
│       │   ├── product.service.ts
│       │   ├── staff.service.ts
│       │   └── reports.service.ts
│       ├── guards/
│       │   ├── auth.guard.ts
│       │   └── admin.guard.ts
│       └── interceptors/
│           └── auth.interceptor.ts   # Auto-attaches JWT to all requests
│
└── docker-compose.yml
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint           | Access |
|--------|--------------------|--------|
| POST   | /api/auth/register | Public |
| POST   | /api/auth/login    | Public |

### Products
| Method | Endpoint                     | Access       |
|--------|------------------------------|--------------|
| GET    | /api/product                 | All users    |
| GET    | /api/product/{id}            | All users    |
| GET    | /api/product/categories      | All users    |
| POST   | /api/product                 | Admin, Staff |
| PUT    | /api/product/{id}            | Admin, Staff |
| PATCH  | /api/product/{id}/quantity   | Admin, Staff |
| DELETE | /api/product/{id}            | Admin only   |

### Staff Management (Admin only)
| Method | Endpoint               |
|--------|------------------------|
| GET    | /api/adminstaff        |
| POST   | /api/adminstaff        |
| DELETE | /api/adminstaff/{id}   |

### Reports (Admin only)
| Method | Endpoint                      |
|--------|-------------------------------|
| GET    | /api/adminreports/summary     |
| GET    | /api/adminreports/lowstock    |
| GET    | /api/adminreports/products    |
| GET    | /api/adminreports/categories  |

---

## ✨ Features

- ✅ JWT Authentication with role-based access (Admin / Staff)
- ✅ Full Product CRUD with search, category filter, pagination
- ✅ Admin dashboard with inventory summary cards
- ✅ Low stock alerts and threshold control
- ✅ Category statistics with visual bar charts
- ✅ Staff management (add/remove)
- ✅ Auto JWT token injection via HTTP interceptor
- ✅ Swagger UI at `/swagger`
- ✅ Docker Compose for one-command deployment
- ✅ PostgreSQL with EF Core migrations + auto-seed

---

## 🔧 Environment Variables

| Variable                              | Default                        |
|---------------------------------------|--------------------------------|
| ConnectionStrings__DefaultConnection | postgres connection string     |
| Jwt__Key                             | Secret key (change in prod!)   |
| Jwt__Issuer                          | InventoryMS                    |
| Jwt__Audience                        | InventoryMS_Users              |

---

## 🗄️ Database

Migrations run automatically on startup via `db.Database.Migrate()`.  
Default admin and staff accounts are seeded automatically via `IdentitySeed.cs`.

To create migrations manually:
```bash
cd backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```
