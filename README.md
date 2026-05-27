# 📝 Blog Platform (MERN Stack)
# Inkwell — Blog Platform


A full-stack blogging platform where users can register, log in, create blog posts, edit/delete their own content, and interact through comments.

## 🚀 Live Demo

🌐 Frontend: https://blog-platform-full-stack-project.vercel.app

⚙️ Backend: https://blog-platform-fullstack-project.onrender.com/health
         https://blog-platform-fullstack-project.onrender.com/api/posts
## ✨ Features

- User Registration & Login
- JWT Authentication & Authorization
- Create, Edit & Delete Blog Posts
- View All Blogs & Individual Blog Details
- Comment System
- Protected Routes
- Responsive UI
- RESTful API Architecture
- MongoDB Database Integration

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

### Deployment
- Vercel
- Render


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

## ⚙️ Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

## 📡 API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Posts
- GET `/api/posts`
- GET `/api/posts/:id`
- POST `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`

### Comments
- GET `/api/comments/:postId`
- POST `/api/comments/:postId`

## 🎯 Skills Demonstrated

- Full Stack Development
- REST API Development
- Authentication & Authorization
- CRUD Operations
- MongoDB Integration
- State Management
- Responsive UI Design
- Deployment & Production Hosting

## 🔮 Future Improvements

- Rich Text Editor
- Search & Filters
- User Profiles
- Categories & Tags
- Image Uploads
- Dark Mode

## 👨‍💻 Author

Akshaya Vasireddi

GitHub: https://github.com/Akshaya-Vasireddi

