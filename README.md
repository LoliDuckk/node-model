# Node Model (Express + Sequelize + Postgres)

## Запуск

### Требования
- Node.js (рекомендуется LTS)
- Postgres

### Установка

```bash
npm install
```

### Переменные окружения

Создайте файл `.env` в корне проекта (можно скопировать из `.env.example`).

Пример (`.env.example`):

```dotenv
PORT=5000

DB_NAME=node_model
DB_USER=postgres
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET_KEY=any_random_secret_jwt_key

# Автосоздание администратора при старте (если пользователя с таким email ещё нет)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123
ADMIN_FULL_NAME=Ivanov Ivan Ivanovich
ADMIN_BIRTHDAY=1970-01-01
```

### Старт сервера

Dev-режим (nodemon):

```bash
npm run dev
```

Сервер поднимается на `http://localhost:${PORT}` и использует префикс `/api`.

При старте выполняется:
- `sequelize.authenticate()`
- `sequelize.sync()`
- автосоздание ADMIN (если заданы `ADMIN_EMAIL` и `ADMIN_PASSWORD`)

## Функционал

### Модель пользователя
- `full_name` — ФИО (обязательно; на регистрации проверяется, что состоит из 3 слов)
- `birthday` — дата рождения (обязательно)
- `email` — уникальный (обязательно)
- `password` — пароль (хранится в виде хеша)
- `role` — `"ADMIN"` или `"USER"`
- `status` — `"ACTIVE"` или `"BLOCKED"`

### Правила доступа
- **Пользователь**: использует только `GET /me` и `PATCH /me/block`
- **Админ**: может получать пользователей по `id`, список всех пользователей, блокировать/разблокировать по `id`
- **Заблокированный пользователь**:
  - не может проходить авторизацию по токену (middleware проверяет `status` в БД)
  - не может залогиниться (`POST /login` вернёт 403)

## API

Базовый префикс: `/api/user`

### 1) Регистрация
`POST /registration`

Body:

```json
{
  "full_name": "Иванов Иван Иванович",
  "birthday": "2000-01-01",
  "email": "user@example.com",
  "password": "pass123"
}
```

Response:

```json
{ "token": "..." }
```

### 2) Авторизация
`POST /login`

Body:

```json
{
  "email": "user@example.com",
  "password": "pass123"
}
```

Response:

```json
{ "token": "..." }
```

### 3) Проверка токена (обновить токен)
`GET /auth`

Headers:
- `Authorization: Bearer <token>`

Response:

```json
{ "token": "..." }
```

### 4) Получить себя
`GET /me`

Headers:
- `Authorization: Bearer <token>`

Response: объект пользователя **без `password`**.

### 5) Заблокировать себя
`PATCH /me/block`

Headers:
- `Authorization: Bearer <token>`

Response: объект пользователя со `status: "BLOCKED"` (без `password`).

### 6) Получить список пользователей (только ADMIN)
`GET /all`

Headers:
- `Authorization: Bearer <token>`

### 7) Получить пользователя по id (только ADMIN)
`GET /:id`

Headers:
- `Authorization: Bearer <token>`

### 8) Блокировка/разблокировка пользователя по id (только ADMIN)
`PATCH /:id/block`

Headers:
- `Authorization: Bearer <token>`

Body:

```json
{ "blocked": true }
```

или

```json
{ "blocked": false }
```

Response: объект пользователя с обновлённым `status` (без `password`).

