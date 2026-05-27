# Inkwell — Blog Platform

A production-ready full-stack blog platform with authentication, posts, and comments.

## Tech Stack

**Frontend:** React + Vite, Tailwind CSS, Axios, React Router  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs  
**Deploy:** Frontend → Vercel · Backend → Render · DB → MongoDB Atlas

---

## Project Structure

```
blog-platform/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT protect middleware
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── PostForm.jsx
    │   │   ├── CommentSection.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── EditPost.jsx
    │   │   ├── PostDetail.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   └── api.js          # Axios service layer
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── .env.example
```

---

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/blogplatform?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend `.env`

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Create free cluster**
2. Choose a cloud provider + region → **Create Cluster**
3. Under **Database Access** → Add a database user with username + password
4. Under **Network Access** → Add IP Address → **Allow access from anywhere** (0.0.0.0/0)
5. Under **Databases** → **Connect** → **Connect your application** → Copy the connection string
6. Replace `<password>` in the string with your actual password
7. Paste into `MONGO_URI` in your backend `.env`

---

## Deploy Backend on Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo → select the repo
4. Configure:
   - **Name:** `inkwell-api` (or anything)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Under **Environment Variables**, add:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — a strong random string (use `openssl rand -base64 32`)
   - `NODE_ENV` — `production`
   - `FRONTEND_URL` — your Vercel URL (add after deploying frontend)
6. Click **Create Web Service**
7. Wait for deploy → copy the URL (e.g. `https://inkwell-api.onrender.com`)

> **Note:** Free Render services spin down after inactivity. First request may take ~30s to cold start.

---

## Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` — your Render backend URL (e.g. `https://inkwell-api.onrender.com`)
5. Click **Deploy**
6. After deploy, copy your Vercel URL and paste it into:
   - Render → backend env var `FRONTEND_URL`
   - Redeploy backend on Render

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Bearer | Get current user |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | Public | List posts (pagination, search) |
| GET | `/api/posts/:id` | Public | Get single post |
| POST | `/api/posts` | Bearer | Create post |
| PUT | `/api/posts/:id` | Bearer (owner) | Update post |
| DELETE | `/api/posts/:id` | Bearer (owner) | Delete post |

**Query params for GET /api/posts:** `?page=1&limit=10&search=keyword&tag=tagname`

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/comments/:postId` | Public | Get comments for post |
| POST | `/api/comments/:postId` | Bearer | Add comment |
| DELETE | `/api/comments/:id` | Bearer (owner) | Delete comment |

---

## Features

- ✅ JWT authentication (register, login, protected routes)
- ✅ Full CRUD for blog posts (owner-only edit/delete)
- ✅ Comments (add, view, delete own)
- ✅ Pagination + full-text search
- ✅ Tag system
- ✅ Rate limiting + Helmet security headers
- ✅ CORS configured for Vercel domain
- ✅ Error handling middleware
- ✅ Auto session expiry handling in frontend
- ✅ Responsive design
