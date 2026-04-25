# DevOps Skill

## Purpose

Deploy, configure, and maintain the Purano Kitab application infrastructure.

## When to Use

- Setting up environments
- Configuring database
- Deploying to production
- Managing environment variables

## Execution Strategy

### 1. Environment Setup

```bash
# Copy example env
cp .env.example .env

# Configure variables
MONGODB_URI=mongodb://localhost:27017/purano_kitab
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. Database

```bash
# Connect via MongoDB URI
MONGODB_URI=mongodb://username:password@host:port/database

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://cluster-name.mongodb.net/database
```

### 3. Build & Deploy

```bash
# Development
yarn start:dev

# Production build
yarn build
yarn start:prod
```

### 4. Docker (Future)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## Commands

```bash
yarn start:dev      # Dev server with hot reload
yarn start:debug   # Debug mode
yarn build         # Build for production
yarn start:prod    # Run production build
```

## Environment Matrix

| Variable | Development | Production |
|----------|-------------|-------------|
| NODE_ENV | development | production |
| MONGODB_URI | localhost | production URI |
| JWT_SECRET | dev-secret | production-secret |
| PORT | 3001 | 3001 |