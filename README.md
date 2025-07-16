# 💪 SFE Tech Task (React Version)

Welcome! This project is a React-based implementation of the sfe-tech-task app, designed to assess frontend skills with a realistic setup. It uses Vite, shadcn/ui, Tailwind CSS, TanStack Query, TanStack Router, and Zustand. The backend API is a Node.js/Express server with an in-memory database.

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```sh
git clone <REPO_URL>
cd sfe-tech-task-react
```

### 2. Start the Backend
```sh
cd backend
npm install
node index.js
```
The backend will run on [http://localhost:3000](http://localhost:3000/).

### 3. Start the Frontend
If you are still in the backend folder, go back to the root folder:
```sh
cd ..
npm install
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173/).

---

## ✅ What’s Already Implemented

### 🔐 Auth
- Login page and auth state management using Zustand.
- Backend API accepts hardcoded credentials (`admin`/`admin123`).
- Token is stored in Zustand after login.

### 👥 User Management
- API endpoints for fetching, creating, and updating users.
- React page stubs for user list, create, and edit (see `/src/routes`).
- UI/UX foundation with shadcn/ui and Tailwind CSS.
- Routing with TanStack Router.

---

## 🧐 Your Task
Your goal is to complete the app’s functionality using React best practices.

### 🔐 Auth
- Implement route protection: restrict `/users` routes to authenticated users only.
- Redirect unauthenticated users to `/login`.

### 👥 Users
- Make the user form fully functional for creating and editing users.
- Add form validation (e.g., required fields, custom validators). Prevent names containing "test".
- Display loading states and error messages as needed.
- Fetch and display users using TanStack Query.
- Use shadcn/ui components for forms and tables.

---

## ✨ Bonus Points
- Add unit tests.
- Improve UI/UX.
- Persist auth state (e.g., localStorage).

---

## 🧹 Git Commit Guidelines
- Start with an initial empty commit (e.g., `chore: start tech task`).
- Use small, clear commits to document your progress.
- End with a final commit (e.g., `feat: complete tech task`).
- We value clean and readable Git history!

---

## 📬 Submission
1. Fork this repository to your own GitHub account.
2. Complete the task in your forked repo.
3. Send us the link to your fork when you're finished.

Good luck! We’re looking forward to seeing how you approach the challenge and what best practices you're going to introduce for us 🚀

---

## 📚 Documentation
- [shadcn/ui](https://ui.shadcn.com/docs/installation/vite)
- [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)

---

## About
- This project is for technical assessment and demo purposes only.
- The backend is in-memory and resets on restart.
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
