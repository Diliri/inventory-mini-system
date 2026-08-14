# 1. Беремо базовий образ Node.js
FROM node:18-alpine

# 2. Створюємо робочу папку в контейнері
WORKDIR /app

# 3. Копіюємо файли залежностей
COPY package*.json ./
COPY prisma ./prisma/

# 4. Встановлюємо залежності та генеруємо Prisma Client
RUN npm install
RUN npx prisma generate

# 5. Копіюємо весь інший код бекенду
COPY . .

# 6. Відкриваємо порт 4000
EXPOSE 4000

# 7. Команда для запуску
CMD ["npm", "run", "dev"]