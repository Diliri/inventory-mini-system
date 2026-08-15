# 📦 Inventory System

A mini-system for managing product inventory supporting full CRUD operations, automated statuses, and real-time notifications.

---

## 📋 Prerequisites

Before getting started, make sure you have the following installed on your machine:

* Git — to clone the repository: https://git-scm.com/downloads
* Node.js (v18 or higher) — for local JS/TS execution and npm: https://nodejs.org/
* PostgreSQL — for the database (if running locally without Docker): https://www.postgresql.org/download/
* Docker Desktop — for quick containerized startup (requires Windows 10/11 Pro/Home with WSL2 support): https://www.docker.com/products/docker-desktop/

---

## ⚙️ Environment Variables

Since the `.env` file is listed in `.gitignore` and won't be pushed to the repository, you need to create it manually inside the `backend` directory.

Create a file named `backend/.env` and add the following config:
```Bush
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public"
```
Note: If you are running the app via Docker Compose, database environment variables are configured automatically inside docker-compose.yml.

---

## 🚀 How to Clone and Run the Project

First, clone the repository to your PC:
```Bush
git clone https://github.com/Diliri/inventory-mini-system.git
cd inventory-mini-system
```
---

### Option 1: Running via Docker Compose (Recommended)

If you have Docker Desktop installed, you can launch the entire stack with a single command:
```Bush
docker-compose up --build
```
* Frontend: http://localhost:3000
* Backend API: http://localhost:4000

---

### Option 2: Running Locally (If your OS does not support Docker)

If your environment doesn't support Docker Desktop, you can start the project manually using locally installed Node.js and PostgreSQL.

#### 1. PostgreSQL Database Setup
1. Open pgAdmin or your PostgreSQL CLI (`psql`).
2. Create a new database named `inventory_db`.

#### 2. Running the Backend
Open a terminal and run:
```Bush
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```
(The backend will start at http://localhost:4000)

#### 3. Running the Frontend
Open a NEW terminal window and run:
```Bush
cd frontend
npm install
npm run dev
```
(The frontend will start at http://localhost:3000)

---

## 📁 Project Structure
```
inventory-mini-system/
├── backend/                  # Server-side application (Node.js/NestJS or Express + Prisma)
│   ├── prisma/               # Prisma database schema and migrations
│   ├── src/                  # Core backend code (models, controllers, services)
│   ├── .env                  # Environment variables (created manually)
│   └── package.json
│
├── frontend/                 # Client-side application (Next.js App Router)
│   ├── app/                  # Application pages and styles
│   │   ├── page.tsx          # Main page with table and iziToast integration
│   │   └── page.module.css   # CSS modules and spinner keyframe animations
│   └── package.json
│
├── .gitignore                # Files and directories ignored by Git
├── docker-compose.yml        # Docker Compose setup for multi-container launch
└── README.md                 # Project documentation
```
