# Email Campaign System

A full-stack email campaign management system built with React, Node.js, Express, MySQL, Sequelize, Redis, BullMQ, and Nodemailer.

The application allows authenticated users to create campaigns, manage recipients, schedule campaigns, and process email delivery asynchronously through a background worker.

## Features

- User authentication with JWT
- Access token and refresh token authentication
- Role-based access control
- Admin and user roles
- Campaign CRUD operations
- Campaign scheduling
- Campaign cancellation
- Recipient CRUD operations
- Soft deletion of recipients
- Campaign-recipient management
- Subscription validation
- Redis integration
- BullMQ email queue
- Background email worker
- Automated campaign scheduling with cron
- Email delivery logging
- Campaign recipient delivery status
- Loading, error, and success states
- Protected frontend routes
- Admin dashboard
- Responsive React UI

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- JavaScript / CommonJS
- Sequelize
- MySQL
- JWT
- bcryptjs
- Nodemailer
- Redis
- BullMQ
- node-cron

## Project Structure

```text
email-campaign-system/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── queues/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── workers/
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── PROJECT_STEPS.md
└── README.md