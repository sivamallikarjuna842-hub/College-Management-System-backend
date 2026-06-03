# 🎓 College Management System

A full-stack web application for managing students, attendance, marks, fees, and more. Built with **Node.js + Express (Backend)** and **React (Frontend)**.

---

## Web Images
<img width="959" height="446" alt="image png" src="https://github.com/user-attachments/assets/94bd3032-977a-4099-9b3a-93641277b853" />

<img width="959" height="434" alt="image3 png" src="https://github.com/user-attachments/assets/6c568d92-b957-4113-bcd2-1eab3eb3a477" />

<img width="956" height="437" alt="image4 png" src="https://github.com/user-attachments/assets/9ee59156-a962-4d82-90b3-85b25d5b7227" />


---

## 📁 Project Structure

```
college-management/
├── backend/                         # Express API server
│   ├── server.js                    # Entry point
│   ├── db.js                        # MongoDB connection
│   ├── package.json                 # Dependencies
│   ├── config/index.js              # Configuration constants
│   ├── middleware/auth.js            # JWT authentication
│   ├── routes/                      # Route definitions
│   │   ├── auth.js                  # POST /api/auth/login
│   │   ├── students.js              # /api/students CRUD
│   │   ├── attendance.js            # /api/attendance
│   │   ├── fees.js                  # /api/fees
│   │   └── chatbot.js               # /api/chatbot
│   ├── controllers/                 # Request handlers
│   ├── models/                      # Mongoose schemas
│   ├── services/memoryStore.js      # In-memory fallback
│   └── utils/                       # Helper functions
│
├── frontend/                        # React app (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── App.js                   # Main application component
│   │   ├── index.js                 # Entry point
│   │   └── ...
│   └── package.json
│
├── functions/                       # Firebase Cloud Functions
├── package.json                     # Root workspace scripts
├── .gitignore
├── .env.example                     # Environment variables template
└── README.md
```

---

## 🛠️ Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | >= 18.x | Runtime |
| **npm** | >= 9.x | Package manager |
| **MongoDB** | >= 6.x | Database (optional — app works with in-memory fallback) |
| **Git** | >= 2.x | Version control |

---

## 🚀 Step-by-Step Build & Run

### Step 1: Clone the Repository
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 4: Configure Environment (Optional)

Copy `.env.example` to `.env` and edit values:

```bash
cp .env.example .env
```

Available environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/college_db` | MongoDB connection string |
| `JWT_SECRET` | `dev_secret_change_me` | Secret for JWT tokens |
| `JWT_EXPIRES_IN` | `8h` | Token expiry duration |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `vastundi` | Admin login password |

> **Note:** If MongoDB is not running, the app **automatically falls back** to in-memory storage — no database setup required!

### Step 5: Start the Backend Server

```bash
cd backend
node server.js
```

**Expected output:**
```
* Server running on http://localhost:5000
* API available at http://localhost:5000/api
* Login endpoint: POST http://localhost:5000/api/auth/login
```

> The server starts immediately even if MongoDB is unavailable. It will attempt to connect to MongoDB in the background and fall back to in-memory mode if it fails.

### Step 6: Start the Frontend (Development Mode)

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

This starts the React dev server on **http://localhost:3000** and proxies API requests to the backend on port 5000.

> **Or use the production build:**
> ```bash
> cd frontend && npm run build
> ```
> The backend will automatically serve the built React app at `http://localhost:5000`.

### Step 7: Login

1. Open **http://localhost:3000** (or **http://localhost:5000** for production build)
2. Login with default credentials:
   - **Username:** `admin`
   - **Password:** `admin`
3. You can change these via `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

---

## 📡 API Endpoints

All endpoints except `/api/auth/login` and `/api/health` require JWT authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check | ❌ |
| `POST` | `/api/auth/login` | Admin login | ❌ |
| `GET` | `/api/students` | List all students | ✅ |
| `POST` | `/api/students` | Add new student | ✅ |
| `PUT` | `/api/students/:id` | Update student | ✅ |
| `DELETE` | `/api/students/:id` | Delete student | ✅ |
| `GET` | `/api/students/:id/marks` | Get student marks | ✅ |
| `POST` | `/api/students/:id/marks/:sem` | Save marks for semester | ✅ |
| `POST` | `/api/students/:id/deposit` | Fee/wallet deposit | ✅ |
| `POST` | `/api/attendance/mark` | Mark attendance | ✅ |
| `GET` | `/api/attendance/:studentId` | Get attendance by date | ✅ |
| `GET` | `/api/fees` | Fee summary statistics | ✅ |
| `GET` | `/api/stats` | Student statistics | ✅ |
| `POST` | `/api/chatbot` | Rule-based assistant | ✅ |

---

## 📦 Features

### Dashboard
- Real-time server status indicator
- Total students, fee collected, fee pending, active programs
- Program-wise and section-wise distribution charts
- Recent student list with fee status

### Student Management
- Add, edit, delete students
- Search by name, ID, program, or section
- Profile view with full details
- Fee payment and wallet deposit

### Marks Management
- Per-semester marks entry (10 subjects)
- Automatic average calculation and grade assignment
- Color-coded grade display (Distinction/Pass/Fail)
- Semester selector

### Fee Management
- Annual fee structure per program
- Payment progress bars
- Fee collection summary
- Defaulter tracking

### Attendance
- Mark attendance per subject (Present/Absent)
- Date-wise attendance records
- Load and review saved attendance

### AI Chatbot
- Rule-based assistant for API guidance
- Answers queries about attendance, fees, students, and marks

---

## 🔧 Running for Production

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Start backend (serves frontend build + API)
cd ../backend && node server.js
```

The app will be available at **http://localhost:5000** — single port, no CORS issues.

---

## ☁️ Deploying to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "Initial commit: College Management System"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

> Make sure your `.gitignore` excludes `node_modules/`, `.env`, `build/`, and `package-lock.json` files.

---

## 🐳 Deployment Options

### Vercel
The project includes a `vercel.json` for serverless deployment. The backend runs as a serverless function with static frontend serving.

### Firebase
The `firebase.json` and `functions/` directory support Firebase Hosting + Cloud Functions deployment.

### Docker (Manual)
```dockerfile
# Dockerfile example
FROM node:18
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/build/ ./frontend/build/
RUN cd backend && npm install
EXPOSE 5000
CMD ["node", "backend/server.js"]
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, CSS (custom design system) |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (via Mongoose) + In-memory fallback |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Security** | Helmet, CORS, Rate Limiting |
| **UI** | Custom dark theme, responsive design |

---

## 📜 License

MIT License — Free to use, modify, and distribute.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
