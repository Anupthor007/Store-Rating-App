# Store Rating System

A web app where users can find stores, rate them, and store owners can see their ratings.

## What it does

- **Users** can sign up, browse stores, and give 1-5 star ratings
- **Store owners** see their ratings and customer feedback  
- **Admins** manage everything - users, stores, and view stats

## Built with

**Backend:** Node.js, Express, PostgreSQL, Prisma  
**Frontend:** React, React Router

## Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/Anupthor007/Store-Rating-App.git
   cd Store-Rating-App
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   ```

3. **Database setup**
   - Install PostgreSQL
   - Create database called `store_rating_db`
   - Add your database info to `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:Anup123@localhost:5432/store_rating_db"
   JWT_SECRET="any-random-secret-key"
   PORT=5000
   ```

4. **Create tables**
   ```bash
   npx prisma db push
   ```

5. **Start backend**
   ```bash
   npm run dev
   ```

6. **Frontend setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Open app**
   - Go to http://localhost:5173
   - Register as a new user and start rating stores!

## Features

### Regular Users
- Register and login
- Search stores by name/location
- Rate stores 1-5 stars
- Update your ratings anytime

### Store Owners  
- View your store's ratings
- See who rated you
- Track your average rating

### Admins
- Create users and stores
- View platform statistics
- Manage everything

## Database

Three main tables:
- **users** - all user accounts with roles
- **stores** - store information 
- **ratings** - connects users to stores with ratings

## API Routes

```
POST /api/auth/login - Login
POST /api/auth/register - Sign up
GET /api/stores/user - Get all stores (for rating)
POST /api/ratings - Submit a rating
GET /api/users/dashboard-stats - Admin stats
```

## Form Rules

- Name: 20-60 characters
- Password: 8-16 chars, needs uppercase + special character
- Address: max 400 characters


---

##The project is made for the Assignment round for the Position of MERN Stack Developer Intern.
