# 🍕 BiteByte — Nutrition-Aware Food Ordering System

> India's first nutrition-aware food ordering application. Order food, track calories, and eat smart.

---

## 📌 Overview

BiteByte is a full-stack food ordering application built for health-conscious users. Unlike traditional food delivery apps, BiteByte provides **real-time nutrition tracking** — every dish shows its calories, protein, carbs, and fat. The smart cart warns you when your order exceeds your daily nutrition goals.

### Key Highlights
- 🔥 **Real-time calorie tracking** in the cart
- 💪 **Goal-based smart alerts** (Weight Loss / Muscle Gain / Balanced)
- 📊 **Macro breakdown** per dish (Protein, Carbs, Fat)
- 🧾 **Order invoice download** functionality
- 🔄 **One-click reorder** from past orders
- 📈 **Personal analytics dashboard** (calorie history, most ordered items)
- 🛡️ **Row Level Security (RLS)** on all database tables
- 🌙 **Dark mode** support
- 📱 **Fully responsive** mobile-first design
- 👨‍💼 **Admin dashboard** with revenue analytics

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, Recharts |
| **Backend**  | Python FastAPI, JWT Auth                         |
| **Database** | PostgreSQL (Supabase)                            |
| **Auth**     | Supabase Auth + JWT tokens                       |
| **Hosting**  | Supabase (DB + Auth), Vite dev server            |

---

## 📁 Project Structure

```
sql_mini_pro/
├── Backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py             # Environment config
│   ├── database.py           # Supabase client setup
│   ├── auth.py               # JWT token creation & verification
│   ├── schemas.py            # Pydantic request/response models
│   └── routers/
│       ├── auth.py           # Register, Login, Profile endpoints
│       ├── menu.py           # Menu endpoints with SQL ILIKE search
│       ├── orders.py         # Orders with pagination & analytics
│       └── admin.py          # Admin dashboard APIs
│
├── Frontend/
│   └── src/
│       ├── App.jsx           # React Router setup
│       ├── api.js            # Axios API client
│       ├── store.js          # Zustand stores (cart, auth)
│       ├── components/
│       │   ├── Navbar.jsx    # Responsive navbar with mobile menu
│       │   ├── FoodCard.jsx  # Menu item card with real images
│       │   ├── Cart.jsx      # Smart cart with nutrition warnings
│       │   ├── OrderCard.jsx # Order card with reorder & invoice
│       │   └── Toast.jsx     # Toast notification system
│       └── pages/
│           ├── Home.jsx      # Landing page with interactive demo
│           ├── Menu.jsx      # Menu with search & category filters
│           ├── Profile.jsx   # Profile with order analytics
│           ├── MyOrders.jsx  # Order history
│           ├── Admin.jsx     # Admin dashboard
│           ├── ERDiagram.jsx # Database schema visualization
│           └── NotFound.jsx  # 404 page
│
└── database/
    ├── recreate_tables.sql   # Full schema + RLS + seed data
    ├── schema.sql            # Schema definition
    ├── seed.sql              # Initial food items data
    └── rls.sql               # Row Level Security policies
```

---

## 🗄️ Database Design (ER Diagram)

```
┌──────────────────┐     1:N     ┌──────────────────┐     1:N     ┌──────────────────┐
│    profiles       │───────────▶│     orders         │───────────▶│   order_items      │
│──────────────────│             │──────────────────│             │──────────────────│
│ PK  id (UUID)     │             │ PK  order_id      │             │ PK  id             │
│     full_name     │             │ FK  user_id        │             │ FK  order_id       │
│     phone         │             │     total_price    │             │ FK  item_id        │
│     address       │             │     total_cal      │             │     item_name      │
│     goal          │             │     order_status   │             │     quantity       │
└──────────────────┘             │     created_at     │             │     unit_price     │
                                  └──────────────────┘             │     calories       │
                                                                    └──────────────────┘
┌──────────────────┐                                                        ▲
│   food_items      │─────────────────────────────────────────────  1:N  ────┘
│──────────────────│
│ PK  item_id       │
│     item_name     │
│     category      │
│     price         │
│     description   │
│     is_veg        │
│     calories      │
│     protein       │
│     carbs         │
│     fat           │
└──────────────────┘
```

### Key SQL Concepts Used
- **Primary Keys & Foreign Keys** — Referential integrity across all tables
- **Row Level Security (RLS)** — Users can only access their own data
- **ILIKE** — Server-side fuzzy search on menu items
- **LIMIT / OFFSET** — Paginated order history
- **Aggregate Functions** — `SUM()`, `COUNT()` for revenue & analytics
- **JOIN via Supabase select** — Related data fetching (orders → order_items)

---

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sql_mini_project.git
cd sql_mini_project
```

### 2. Database Setup (Supabase)
1. Create a new Supabase project
2. Go to **SQL Editor** and run `database/recreate_tables.sql`
3. Copy your Supabase URL, anon key, and service role key

### 3. Backend Setup
```bash
cd Backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
```

Create `Backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=your-admin@email.com
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd Frontend
npm install
```

Create `Frontend/.env`:
```env
VITE_ADMIN_EMAIL=your-admin@email.com
```

Start the frontend:
```bash
npm run dev
```

---

## ✨ Features in Detail

### 🛒 Smart Cart with Nutrition Tracking
The cart calculates total calories, protein, carbs, and fat in real-time. Based on the user's selected goal (Weight Loss, Muscle Gain, or Balanced), it shows warnings when:
- Calorie intake exceeds the goal limit
- Fat content is too high
- Protein is too low for muscle gain

### 📊 Personal Order Analytics
The Profile page shows:
- Total orders, total spent, total calories consumed
- Average calories per order
- Calorie history bar chart (Recharts)
- Most ordered items with progress bars

### 🧾 Invoice Download
Each order has an "Invoice" button that generates a formatted text receipt with item breakdown, totals, and calories.

### 🔄 One-Click Reorder
Past orders have a "Reorder" button that adds all items back to the cart instantly.

### 🗂️ Database Schema Visualization
Visit `/schema` to see an interactive ER diagram of the database with:
- All 4 tables with column details
- PK/FK relationships with cardinality
- RLS policies per table
- Sample SQL query

### 🔐 Security
- JWT-based authentication
- Row Level Security on all tables
- Separate Supabase clients (public vs service role)
- User-specific cart storage (localStorage namespaced by user ID)

---

## 👤 Team

| Role      | Name             |
|-----------|------------------|
| Developer | Your Name Here   |

---

## 📜 License

This project was built as a Mini Project for academic purposes.

---

<p align="center">
  <b>BiteByte</b> — Order Food. Track Nutrition. Eat Smart. 🍕
</p>
