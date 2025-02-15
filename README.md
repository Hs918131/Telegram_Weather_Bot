# 🌤️ Telegram Weather Bot with Admin Panel

A full-stack application featuring a Telegram bot that provides weather updates and an administrative panel for user management. Built with NestJS, React, and PostgreSQL.

#### Admin_Panel = [https://telegram-weather-bot-1-e9yo.onrender.com/](https://telegram-weather-bot-1-e9yo.onrender.com/)
#### Bot_Link = [https://t.me/hs918131_ast_bot](https://t.me/hs918131_ast_bot)

# 🌟 Features

## Telegram Bot
- Daily weather updates for subscribed users
- Real-time weather information on demand
- Location-based weather forecasts
- User subscription management

## Admin Panel
- Secure Google OAuth authentication
- Comprehensive user management
  - View all subscribers
  - Block/unblock users
  - Delete user accounts
- Bot settings management
  - Weather API key configuration
  - Telegram bot token management
- Real-time user activity monitoring

# 🏗️ Technology Stack

## Backend
- **NodeJS** - TypeScript-based Node.js framework
- **Prisma ORM** - Database management and migrations
- **PostgreSQL** - Primary database
- **nestjs-telegraf** - Telegram bot integration
- **@nestjs/schedule** - Scheduled tasks for daily updates

## Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling

# 📁 Project Structure

```
telegram-weather-bot/
├── backend/
│   ├── src/
│   │   ├── admin/         # Admin panel logic
│   │   ├── auth/          # Authentication
│   │   ├── config/        # Configuration
│   │   ├── prisma/        # Database connection
│   │   ├── telegram/      # Telegram bot logic
│   │   ├── weather/       # Weather API integration
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── prisma/
│       └── schema.prisma  # Database schema
├── frontend/
│   ├── src/
│   │   ├── components/AdminPanel
│   │   ├── App.jsx
│   ├── public/
│   ├── package.json
└── README.md
```


# 🚀 Getting Started

## Prerequisites
- NestJS
- PostgreSQL
- Telegram Bot Token (from BotFather)
- Weather API Key
- Google OAuth credentials

## Installation

### 1. Clone the repository
bash

`git clone <https://github.com/Hs918131/Telegram_Weather_Bot>`

`cd telegram-weather-bot`

### 2. Backend Setup
bash

`cd backend`

`npm install`

#### Create .env file

`cp .env.example .env`

#### Update database schema
`npx prisma generate`

`npx prisma db push`

#### Start the server
`npm run start:dev`


### 3. Frontend Setup
bash

`cd frontend`

`npm install`

`npm start`

## Environment Variables

Create .env files in both backend and frontend directories:

**Backend (.env)**
env
- `DATABASE_URL="postgresql://user:password@localhost:5432/telegram_bot"`

- `PORT=3000`

- `TELEGRAM_BOT_TOKEN="your_bot_token"`

- `WEATHER_API_KEY="your_weather_api_key"`

- `GOOGLE_CLIENT_ID="your_google_client_id"`

- `GOOGLE_CLIENT_SECRET="your_google_client_secret"`

- `JWT_SECRET="your_jwt_secret"`

**Frontend (.env)**
env
- `VITE_FIREBASE_API_KEY=your_api_key`

- `VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com`

- `VITE_FIREBASE_PROJECT_ID=your_project_id`

- `VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com`

- `VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id`

- `VITE_FIREBASE_APP_ID=your_app_id`


# 🤖 Bot Commands

- /start - Initialize the bot
- /subscribe <city> - Subscribe to daily weather updates
- /unsubscribe - Unsubscribe from updates
- /weather <city> - Get current weather

# 🔐 Admin Panel Endpoints

## User Management
- GET /admin/users - List all users
- GET /admin/users/:id - Get specific user
- POST /admin/users/:id/:action - Perform user action (block/unblock)
- DELETE /admin/users/:id - Delete user

## Settings Management
- GET /admin/settings - Get bot settings
- PUT /admin/settings - Update bot settings

# 🛠️ Development

## Database Migrations
bash
## Generate migration
`npx prisma migrate dev --name migration_name`

## Apply migrations
`npx prisma migrate deploy`


## Running Tests
bash
## Backend tests
`cd backend`

`npm run test`

## Frontend tests
`cd frontend`

`npm test`

# 📝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

# 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
