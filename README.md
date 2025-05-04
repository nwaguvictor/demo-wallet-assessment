# 💳 Demo Credit – Wallet Service MVP

Demo Credit is a mobile lending app. This wallet service MVP enables the following core wallet functionalities:

- ✅ Create user accounts
- 💰 Fund user wallets
- 🔁 Transfer funds between users
- 💸 Withdraw funds from wallet
- ❌ Prevent onboarding for users on the [Lendsqr Adjutor Karma Blacklist](https://api.adjutor.io/)

---

## 🗂️ Table of Contents

1. [Getting Started](#-getting-started)
2. [Environment Variables](#️-environment-variables)
3. [Run Migrations](#-run-migrations)
4. [Start Application](#-start-application)
5. [File Structure](#-file-structure)
6. [API Endpoints](#-api-endpoints)
7. [E-R Diagram](#-e-r-diagram)
8. [Testing](#-testing)
9. [License](#-license)
10. [Tech Stach ](#-tech-stack)

---

## 🚀 Getting Started

### 🔃 Clone the Repository

```bash
git clone https://github.com/nwaguvictor/demo-wallet-assessment
cd demo-wallet-assessment
```

### Install Dependencies

```bash
npm install
```

## 🛠️ Environment Variables

> Create a .env file in the project root and configure as follows:

```env
PORT=
NODE_ENV=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=

ALLOW_BLACKLIST_CHECK=false //Allow the lendsql blacklist check when unboarding new users

ADJUTOR_APP_ID=your_adjutor_app_id
ADJUTOR_API_KEY=your_adjutor_api_key
```

## 📂 Run Migrations

```bash
  npm run migrate
```

## 🏁 Start Application

### 🛠️ Build the application

```bash
  npm run build
```

### ▶️ Start the server

```bash
  npm run start:dev
```

## 📁 File Structure

```bash
  src/
  ├── config/              # App and env configuration
  ├── controllers/         # Route handlers
  ├── database/            # Migrations and seeds
  ├── interfaces/          # TypeScript types and enums
  ├── middlewares/         # Error and auth middleware
  ├── routes/              # API route definitions
  ├── services/            # Business logic
  ├── tests/               # Unit tests
  ├── utils/               # Custom error and helpers
  ├── validators/          # Joi schemas
  ├── index.ts             # Entry point
  ├── knexfile.ts          # Knex config
  .env                     # Environment configuration
```

## 📡 API Endpoints

> Base URL: `/api/v1`

### 🔐 Auth Routes

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/auths/register` | Register new user     |
| POST   | `/auths/login`    | Faux login with token |

### 👤 User & Wallet Routes

> Requires: `Authorization: Bearer <user_id>`

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/users/me`                 | Get current user info    |
| POST   | `/users/me/wallet/fund`     | Fund user's wallet       |
| POST   | `/users/me/wallet/transfer` | Transfer to another user |
| POST   | `/users/me/wallet/withdraw` | Withdraw from wallet     |

## 🧬 E-R Diagram

View it via [E-R Diagram](https://dbdiagram.io/d/6816b8681ca52373f55817a6)

## 🧪 Testing

> Run all unit tests using:

```bash
  npm test
```

## 📄 License

> This project is licensed under the MIT License.

## 🧱 Tech Stack

- NodeJS (LTS version) + Express
- TypeScript
- KnexJs + MySQL
- Jest (for testing)

## Notes:

Since we’re using a free hosting service and a free hosted database, there will be a cold start for these services when inactive for 15mins. This means that the first api call/request could take more than 30ms to get response.

> [Hosted base url](https://victor-nwagu-lendsqr-be-test.onrender.com/api/v1)

> [Health check url](https://victor-nwagu-lendsqr-be-test.onrender.com/ping)
