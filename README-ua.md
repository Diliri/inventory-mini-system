# 📦 Inventory System

Міні-система для управління складським обліком продуктів з підтримкою CRUD-операцій, авто-статусами та сповіщеннями в реальному часі.

---

## 📋 Передумови (Prerequisites)

Перед початком переконайтеся, що на вашому ПК встановлено:

* **[Git](https://git-scm.com/downloads)** — для клонування репозиторію.
* **[Node.js](https://nodejs.org/)** (v18 або новіша) — для локального запуску JS/TS та npm.
* **[PostgreSQL](https://www.postgresql.org/download/)** — для бази даних (якщо запускаєте без Docker).
* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — для швидкого контейнеризованого запуску *(потрібна Windows 10/11 Pro/Home з підтримкою WSL2)*.

---

## ⚙️ Змінні оточення (Environment Variables)

Оскільки файл `.env` знаходиться в `.gitignore` і не потрапляє в репозиторій, вам потрібно створити його самостійно в папці **`backend`**.

Створіть файл `backend/.env` та додайте туди наступні дані:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public"
```

Примітка: Якщо ви використовуєте Docker Compose, змінні для бази даних налаштовуються автоматично всередині docker-compose.yml.

🚀 Як клонувати та запустити проект
Спочатку склонуйте репозиторій на свій ПК:
```Bash
git clone [https://github.com/Diliri/inventory-mini-system.git](https://github.com/Diliri/inventory-mini-system.git)
cd inventory-mini-system
```

Варіант 1: Запуск через Docker Compose (Рекомендовано)
Якщо у вас встановлено Docker Desktop, запуск здійснюється однією командою:

```Bash
docker-compose up --build
```
Frontend: http://localhost:3000

Backend API: http://localhost:4000

Варіант 2: Локальний запуск (Якщо Windows не підтримує Docker)
Якщо ваша версія Windows не підтримує Docker Desktop, запустить проект вручну за допомогою локально встановлених Node.js та PostgreSQL.

1. Налаштування бази даних PostgreSQL
Відкрийте pgAdmin або термінал PostgreSQL (psql).

Створіть нову базу даних з назвою inventory_db.

2. Запуск Backend
Відкрийте термінал та виконайте:
```Bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```
(Backend запуститься на http://localhost:4000)

3. Запуск Frontend
Відкрийте новий термінал та виконайте:

```Bash
cd frontend
npm install
npm run dev
```
(Frontend запуститься на http://localhost:3000)

📁 Структура проекту
```Plaintext
inventory-mini-system/
├── backend/                  # Серверна частина (Node.js/NestJS або Express + Prisma)
│   ├── prisma/               # Схема та міграції бази даних Prisma
│   ├── src/                  # Основний код бекенду (моделі, контролери, сервіси)
│   ├── .env                  # Змінні оточення (створюється вручну)
│   └── package.json
│
├── frontend/                 # Клієнтська частина (Next.js App Router)
│   ├── app/                  # Сторінки та стилі додатка
│   │   ├── page.tsx          # Головна сторінка з таблицею та iziToast
│   │   └── page.module.css   # CSS-модулі та анімація спінера
│   └── package.json
│
├── .gitignore                # Файли та папки, що ігноруються Git
├── docker-compose.yml        # Конфігурація для Docker запускa
└── README.md                 # Документація проекту
```
