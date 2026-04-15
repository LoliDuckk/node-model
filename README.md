# Node Model (Express + Sequelize + Postgres)

## О проекте

REST API приложение для управления пользователями с системой аутентификации и авторизации. Приложение предоставляет полный набор CRUD операций для пользователей, включая регистрацию, авторизацию, управление профилями и административные функции.

## Основные возможности

- **Аутентификация и авторизация**: JWT токены, защита маршрутов
- **Управление пользователями**: Регистрация, вход, профили пользователей
- **Ролевая система**: Разделение на обычных пользователей и администраторов
- **Блокировка аккаунтов**: Возможность блокировки пользователей администраторами
- **API документация**: Swagger UI для интерактивной документации
- **Безопасность**: Rate limiting, CORS, Helmet, bcrypt хеширование
- **Пагинация**: Оптимизированные запросы для больших объемов данных
- **Health checks**: Мониторинг состояния приложения

## Требования

- Node.js 20+
- PostgreSQL 15+
- npm или yarn
- Docker (опционально)

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone <repository-url>
cd node-model
npm install
```

### 2. Конфигурация окружения

Скопируйте файл `.env.example` в `.env` и настройте переменные окружения:

```bash
cp .env.example .env
```

Пример конфигурации:

```dotenv
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=node_model
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPass123
ADMIN_FULL_NAME=Admin Admin Admin
ADMIN_BIRTHDAY=1970-01-01

# API
API_URL=http://localhost:5000
```

### 3. Запуск с Docker (рекомендуется)

```bash
# Запуск PostgreSQL и приложения
docker-compose up -d

# Или для разработки
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 4. Запуск локально

```bash
# Создание БД и запуск миграций
npm run db:migrate

# Запуск в режиме разработки
npm run dev

# Или production сборка
npm start
```

## API Документация

После запуска приложения документация будет доступна по адресу:
**http://localhost:5000/api/docs**

## API Endpoints

### Аутентификация

| Метод | Endpoint                 | Описание                                | Доступ         |
| ----- | ------------------------ | --------------------------------------- | -------------- |
| POST  | `/api/user/registration` | Регистрация нового пользователя         | Все            |
| POST  | `/api/user/login`        | Вход в систему                          | Все            |
| GET   | `/api/user/auth`         | Проверка токена и обновление            | Авторизованные |
| GET   | `/api/user/me`           | Получение профиля текущего пользователя | Авторизованные |

### Управление пользователями

| Метод | Endpoint              | Описание                                 | Доступ         |
| ----- | --------------------- | ---------------------------------------- | -------------- |
| GET   | `/api/user/me`        | Профиль текущего пользователя            | Авторизованные |
| PATCH | `/api/user/me/block`  | Самоблокировка аккаунта                  | Авторизованные |
| GET   | `/api/user/all`       | Список всех пользователей (с пагинацией) | Администраторы |
| GET   | `/api/user/:id`       | Получение пользователя по ID             | Администраторы |
| PATCH | `/api/user/:id/block` | Блокировка/разблокировка пользователя    | Администраторы |

### Системные

| Метод | Endpoint      | Описание                      | Доступ |
| ----- | ------------- | ----------------------------- | ------ |
| GET   | `/api/health` | Проверка состояния приложения | Все    |

## Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск с покрытием
npm run test:coverage

# Запуск только интеграционных тестов
npm run test:integration
```

## Структура проекта

```
node-model/
├── controllers/          # Контроллеры приложения
│   └── userController.js # Логика работы с пользователями
├── middleware/           # Промежуточное ПО
│   ├── authMiddleware.js      # Аутентификация
│   ├── checkRoleMiddleware.js # Проверка ролей
│   ├── errorHandlingMiddleware.js # Обработка ошибок
│   ├── rateLimitMiddleware.js     # Ограничение запросов
│   └── verifyToken.js             # Валидация JWT
├── models/               # Модели базы данных
│   └── models.js         # Определение модели User
├── routes/               # Маршруты API
│   ├── index.js          # Основной роутер
│   └── userRouter.js     # Пользовательские маршруты
├── utils/                # Утилиты
│   ├── logger.js         # Логирование
│   ├── swaggerOptions.js # Конфигурация Swagger
│   └── seedAdmin.js      # Создание админа
├── migrations/           # Миграции базы данных
├── tests/                # Тесты
│   ├── utils.test.js     # Unit тесты утилит
│   ├── middleware.test.js # Тесты middleware
│   ├── rateLimiting.test.js # Тесты rate limiting
│   └── integration.test.js # Интеграционные тесты
├── config/               # Конфигурация Sequelize
│   └── config.js         # Настройки подключения к БД
├── logs/                 # Логи приложения
├── Dockerfile            # Docker образ
├── docker-compose.yml    # Docker Compose
├── jest.config.js        # Конфигурация Jest
├── package.json          # Зависимости и скрипты
└── README.md             # Документация
```

## Скрипты

| Команда                     | Описание                             |
| --------------------------- | ------------------------------------ |
| `npm run dev`               | Запуск в режиме разработки (nodemon) |
| `npm start`                 | Production запуск                    |
| `npm test`                  | Запуск тестов                        |
| `npm run db:migrate`        | Запуск миграций                      |
| `npm run db:migrate:undo`   | Откат последней миграции             |
| `npm run db:migrate:status` | Статус миграций                      |

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.
