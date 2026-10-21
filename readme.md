
# ⚡ SPARK Club Website

A full-stack platform for the **SPARK CSE Club** to showcase its activities and manage events, projects, achievements, gallery, and team information through a centralized admin dashboard.

## ✨ Key Features

- **Content Management:** Manage events, projects, achievements, gallery, and team information.
- **Role-Based Access Control:** Four administrative roles with backend-enforced permissions.
- **Secure Authentication:** JWT authentication with HTTP-only cookies and access-token refresh.
- **Redis Caching:** Resource-specific TTLs and cache invalidation to reduce repeated database queries.
- **Cloudinary Integration:** Cloud-based image uploads and management.
- **Dashboard Analytics:** Dedicated statistics API for resource counts.
- **Responsive UI:** Light/dark themes, reusable components, and mobile-friendly layouts.

## 🛠️ Tech Stack

**Frontend:** React, Redux Toolkit, Axios, Css 

**Backend:** Node.js, Express.js, MongoDB

**Infrastructure:** Redis, Cloudinary, JWT

## 🔐 Admin Permissions

| Module | President | Vice President | Technical Head | Secretary |
|---|---|---|---|---|
| Events | Full CRUD | Full CRUD | Full CRUD | — |
| Projects | Full CRUD | Full CRUD | Full CRUD | — |
| Gallery | Full CRUD | Full CRUD | — | Full CRUD |
| Achievements | Full CRUD | Full CRUD | — | Full CRUD |
| Team | Full CRUD | — | — | — |

*All permissions are enforced on the backend.*

## 📁 Project Structure

```text
spark-club-website/
│
├── client/
│   ├── dist/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   └── utils/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── README.md
```

## ⚙️ Getting Started

**Prerequisites:** Node.js, MongoDB, Redis, and Cloudinary credentials.

### 1. Clone the repository

```bash
git clone https://github.com/Spark-cse-club/Spark_club.git
cd spark-club-website
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the backend directory.

Example configuration:

```env
PORT=5000

MONGO_URI = your_mongodb_connection_string
REDIS_URL = your_redis_connection_url

ACCESS_TOKEN_SECRET = your_access_token_secret
REFRESH_TOKEN_SECRET = your_refresh_token_secret
JWT_EXPIRES_IN = 15m

CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret

Vite_Base_URL = http://localhost:5173
```
Start the backend using the script defined in `server/package.json`, for example:

```bash
npm run dev
```

### 3. Configure the frontend

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL = http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Ensure MongoDB and Redis are running and the required environment variables are configured before starting the application.

## 🏗️ Architecture

```text
React + Redux Toolkit
        |
        v
   Express REST API
        |
        +---- JWT Authentication & RBAC
        |
        +---- Redis Caching
        |
        +---- MongoDB
        |
        +---- Cloudinary
```

---

🌐 Live Website: https://spark-club-wine.vercel.app/

📂 GitHub Repository: https://github.com/Spark-cse-club/Spark_club.git

---

