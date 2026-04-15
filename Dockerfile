FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей, включая sequelize-cli для выполнения миграций
RUN npm ci

# Копирование исходного кода
COPY . .

# Экспозиция порта
EXPOSE 5000

# Запуск приложения
CMD ["node", "index.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
