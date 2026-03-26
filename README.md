# Task Tracker App

A full-stack Task Management System built with React, Node.js, Express, and MongoDB.

## Features
- **User Authentication:** JWT-based login and registration.
- **Task Management:** Create, Read, Update, Delete (CRUD) tasks.
- **Filtering & Search:** Filter tasks by status and priority, and search by title.
- **Analytics Dashboard:** Visualize task completion rates.
- **Responsive UI:** Built with Tailwind CSS for mobile and desktop support.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, TypeScript, Mongoose
- **Database:** MongoDB (using Mongoose for schema validation)

## Setup Steps

### 1. Install Dependencies

Install dependencies for both backend and frontend:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/task-tracker-db
JWT_SECRET=your_super_secret_jwt_key
```

> **Note:** The backend is configured to run on port 5001. If you change this, update `frontend/vite.config.ts` to match the proxy target.

### 3. Run the Application

You need to run both the backend server and the frontend development server simultaneously.

**Backend:**
```bash
cd backend
npm run dev
```
The server will start on port 5001 (or the port defined in your `.env`).

**Frontend:**
```bash
cd frontend
npm run dev
```
The application will be available at [http://localhost:5173](http://localhost:5173).

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user & get token | No |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks (supports filtering by `status`, `priority`, `search`, `sortBy`) | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| GET | `/api/tasks/analytics` | Get task statistics (total, completed, pending) | Yes |

## Design Decisions

- **Architecture:** Separated frontend (React) and backend (Express) to allow independent scaling and clearer separation of concerns.
- **State Management:** Used React Context API (`AuthContext`) for global authentication state management instead of Redux, as the app's complexity didn't require a heavy state management library.
- **Authentication:** Implemented stateless authentication using JSON Web Tokens (JWT). Tokens are stored in `localStorage` and sent via the `Authorization` header on API requests.
- **Database Schema:** MongoDB was chosen for its flexibility. The `Task` schema includes references to the `User` schema, enabling user-specific data isolation.
- **Styling:** Tailwind CSS was used for rapid UI development and to ensure a consistent design system without writing custom CSS.
- **Type Safety:** TypeScript is used throughout the stack to prevent common runtime errors and improve developer experience with better tooling support.
