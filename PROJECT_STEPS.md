# Email Campaign System — Project Steps

This document records the implementation stages completed while building the Email Campaign System.

---

## Stage 1 — Backend Project Setup

### Completed

- Created the backend project structure.
- Initialized Node.js project.
- Installed Express.
- Added dotenv.
- Added CORS.
- Added Nodemon.
- Created `src/server.js`.
- Added health endpoint.
- Added development and build scripts.
- Initialized Git repository.

### Verification

- Backend server started successfully.
- Health endpoint returned a successful response.

---

## Stage 2 — Environment and Database Configuration

### 2.1 Environment Configuration

Created environment configuration for:

- Node environment
- Server port
- Application name
- API prefix
- Database configuration
- Authentication configuration
- Redis configuration
- SMTP configuration

Created:

```text
server/.env
server/.env.example