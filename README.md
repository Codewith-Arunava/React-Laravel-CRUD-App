# 📝 React + Laravel CRUD App

A full-stack **Post Management System** — React 19 frontend + Laravel 13 REST API with token-based authentication (Sanctum) and SQLite database.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---| 
| Frontend | React 19, Vite, React Router v7, Axios |
| Backend | Laravel 13 (PHP 8.3+), Laravel Sanctum |
| Database | SQLite (no setup needed) |
| Styling | Vanilla CSS |

---

## ✅ Prerequisites

- **PHP** >= 8.3 → `php --version`
- **Composer** >= 2.x → `composer --version`
- **Node.js** >= 18 → `node --version`

---

## 🚀 Setup & Installation

### Backend (Laravel)

```bash
cd backend
composer install

# Create the SQLite database file (PowerShell)
New-Item -ItemType File -Path database\database.sqlite -Force

# Run migrations
php artisan migrate
```

> The `.env` file is already included with a valid `APP_KEY` and SQLite config.

### Frontend (React)

```bash
cd frontend
npm install
```

---

## ▶️ Running the App

Open **two terminals** and run both simultaneously:

```bash
# Terminal 1 — Laravel backend (http://localhost:8000)
cd backend
php artisan serve

# Terminal 2 — React frontend (http://localhost:5173)
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

> **Tip:** You can also run everything at once from `backend/` with `composer run dev`.

---

## 🌐 API Endpoints

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login and get token |
| POST | `/logout` | ✅ | Revoke token |
| GET | `/user` | ✅ | Get current user |
| GET | `/posts` | ✅ | List your posts |
| POST | `/posts` | ✅ | Create a post |
| GET | `/posts/{id}` | ✅ | Get a single post |
| PUT | `/posts/{id}` | ✅ | Update a post |
| DELETE | `/posts/{id}` | ✅ | Delete a post |

**Post fields:** `title`, `body`, `author`, `category`, `status` (`published` / `draft`)

---

## 🧭 How to Use

1. **Register** at `/register` or **Login** at `/login`
2. You're redirected to the **Posts dashboard** at `/posts`
3. **Create** posts with the `+ Create New` button
4. **Edit** a post with the ✏️ icon — **Delete** with the 🗑️ icon
5. **Logout** via the Navbar

> Each user only sees and manages **their own posts**.

---

## 🐛 Common Issues

| Problem | Fix |
|---|---|
| `migrate` fails — SQLite not found | Run `New-Item -ItemType File -Path database\database.sqlite -Force` |
| Blank page / CORS errors | Make sure both servers are running on ports `8000` and `5173` |
| `npm run dev` — module not found | Run `npm install` inside `frontend/` first |
| 401 after `migrate:fresh` | Tokens are wiped — just log in again |

---

## 📁 Project Structure

```
├── backend/          # Laravel API
│   ├── app/Http/Controllers/
│   │   ├── AuthController.php   # Register, Login, Logout
│   │   └── PostController.php   # CRUD operations
│   ├── app/Models/              # Post, User models
│   ├── routes/api.php           # All API routes
│   └── .env                     # Config (SQLite, Sanctum)
│
└── frontend/         # React + Vite
    └── src/
        ├── api/axios.js          # Axios + auth interceptors
        ├── context/AuthContext.jsx  # Global auth state
        ├── components/           # Navbar, ProtectedRoute
        └── pages/                # Login, Register, Posts, PostForm
```

---

Built with ❤️ using **React** + **Laravel**
