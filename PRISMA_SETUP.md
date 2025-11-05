# Prisma + Neon PostgreSQL Authentication Setup Guide

## 🎯 Overview
This guide will help you integrate Prisma with Neon PostgreSQL for authentication in your eChannelling Admin Dashboard.

## ✅ What Has Been Set Up

### 1. **Installed Packages**
- ✅ `@prisma/client` - Prisma ORM client
- ✅ `prisma` - Prisma CLI (dev dependency)
- ✅ `bcryptjs` - Password hashing
- ✅ `jsonwebtoken` - JWT token generation
- ✅ `@types/jsonwebtoken` - TypeScript types for JWT

### 2. **Created Files**
- ✅ `prisma/schema.prisma` - Database schema with User, Session, PasswordReset, and Branch models
- ✅ `prisma/seed.ts` - Seed script to create initial admin and test users
- ✅ `lib/prisma.ts` - Prisma client singleton
- ✅ `lib/jwt.ts` - JWT utility functions
- ✅ `lib/authServicePrisma.ts` - Complete authentication service with Prisma
- ✅ `app/api/auth/login/route.ts` - Login API endpoint
- ✅ `app/api/auth/forgot-password/route.ts` - Password reset request endpoint
- ✅ `app/api/auth/verify-otp/route.ts` - OTP verification endpoint
- ✅ `app/api/auth/reset-password/route.ts` - Password reset endpoint
- ✅ `.env` - Environment variables template

### 3. **Updated Files**
- ✅ `lib/authService.ts` - Updated to use new Prisma-based API endpoints

## 🚀 Setup Instructions

### **Step 1: Configure Your Neon Database**

1. **Get your Neon connection string** from your Neon dashboard
2. **Open `.env` file** and replace the DATABASE_URL with your actual Neon connection string:

```env
DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
```

Example:
```env
DATABASE_URL="postgresql://myuser:mypass123@ep-cool-mountain-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

3. **Generate a JWT secret** (run this in terminal):
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to `.env`:
```env
JWT_SECRET="your-generated-secret-key-here"
```

### **Step 2: Generate Prisma Client**

Run this command to generate the Prisma client:

```powershell
cd "C:\Users\User\OneDrive\Desktop\Echanelling\Admin\Echannelling_login_branches"
npx prisma generate
```

### **Step 3: Push Database Schema to Neon**

Push the schema to your Neon database:

```powershell
npx prisma db push
```

This will create all the necessary tables in your Neon database.

### **Step 4: Seed the Database**

Add this to your `package.json` in the root:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Then install tsx and run the seed:

```powershell
pnpm add -D tsx
npx prisma db seed
```

This will create:
- Admin user: username: `admin`, password: `admin123`, 2FA: `123456`
- Regular user: username: `user`, password: `user123`, 2FA: `123456`
- Two sample branches

### **Step 5: Restart Your Development Server**

```powershell
pnpm dev
```

## 🔐 Database Models

### **User Model**
```prisma
- id: String (CUID)
- username: String (unique)
- email: String (unique)
- password: String (hashed)
- name: String
- role: String (user/admin/superadmin)
- phone: String?
- isActive: Boolean
- twoFASecret: String?
- twoFAEnabled: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

### **Session Model**
```prisma
- id: String (CUID)
- userId: String
- token: String (JWT)
- expiresAt: DateTime
- createdAt: DateTime
```

### **PasswordReset Model**
```prisma
- id: String (CUID)
- userId: String
- token: String
- otp: String (6-digit code)
- expiresAt: DateTime
- used: Boolean
- createdAt: DateTime
```

### **Branch Model**
```prisma
- id: String (CUID)
- name: String
- address: String
- city: String
- phone: String
- email: String?
- isActive: Boolean
- managerId: String?
- createdAt: DateTime
- updatedAt: DateTime
```

## 📡 API Endpoints

### **POST /api/auth/login**
Login with username/email, password, and 2FA code.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123",
  "twoFA": "123456"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "Admin User",
    "role": "superadmin",
    "email": "admin@echannelling.lk",
    "username": "admin"
  }
}
```

### **POST /api/auth/forgot-password**
Request password reset OTP.

**Request:**
```json
{
  "identifier": "admin@echannelling.lk"
}
```

### **POST /api/auth/verify-otp**
Verify OTP and get reset token.

**Request:**
```json
{
  "identifier": "admin@echannelling.lk",
  "otp": "123456"
}
```

### **POST /api/auth/reset-password**
Reset password with token.

**Request:**
```json
{
  "resetToken": "reset-token-here",
  "newPassword": "newpassword123"
}
```

## 🛠️ Useful Prisma Commands

```powershell
# Generate Prisma Client
npx prisma generate

# Push schema to database (without migrations)
npx prisma db push

# Create and apply migrations
npx prisma migrate dev --name init

# Open Prisma Studio (GUI for database)
npx prisma studio

# Seed database
npx prisma db seed

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

## 🔄 Authentication Flow

1. **User enters credentials** → Frontend sends to `/api/auth/login`
2. **API validates credentials** → Checks username/email and password in database
3. **Password verification** → Uses bcrypt to compare hashed passwords
4. **2FA check** → Verifies 2FA code (currently simple check, can be enhanced)
5. **Generate JWT token** → Creates JWT with user data
6. **Create session** → Stores session in database
7. **Return token** → Frontend stores token in localStorage/cookie
8. **Protected routes** → Verify token on each request

## 🔒 Security Features

- ✅ **Password Hashing** - Using bcryptjs with salt rounds
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **Session Management** - Track active sessions in database
- ✅ **OTP for Password Reset** - 6-digit OTP with expiration
- ✅ **2FA Support** - Two-factor authentication framework
- ✅ **Session Expiry** - Automatic token expiration (7 days)
- ✅ **SQL Injection Protection** - Prisma parameterized queries

## 📝 Testing the Setup

1. **Start the dev server**: `pnpm dev`
2. **Navigate to**: http://localhost:3000/login
3. **Login with**:
   - Username: `admin`
   - Password: `admin123`
   - 2FA: `123456`

4. **Test password reset**:
   - Go to forgot password
   - Enter: `admin@echannelling.lk`
   - Check console for OTP (in production, this would be sent via email/SMS)
   - Enter the OTP
   - Set new password

## 🎯 Next Steps

1. ✅ **Configure Neon Database** - Add your connection string
2. ✅ **Generate Prisma Client** - Run `npx prisma generate`
3. ✅ **Push Schema** - Run `npx prisma db push`
4. ✅ **Seed Database** - Run `npx prisma db seed`
5. 🔄 **Test Authentication** - Login with admin credentials
6. 📧 **Add Email Service** - Integrate email service for OTP
7. 📱 **Enhance 2FA** - Implement proper 2FA with authenticator apps
8. 🔐 **Add Middleware** - Protect API routes with authentication middleware

## 🐛 Troubleshooting

### Error: "Module '@prisma/client' has no exported member 'PrismaClient'"
**Solution:** Run `npx prisma generate`

### Error: "Invalid `prisma.user.findFirst()` invocation"
**Solution:** 
1. Check your DATABASE_URL in `.env`
2. Run `npx prisma db push`

### Error: "P1001: Can't reach database server"
**Solution:**
1. Verify Neon database URL
2. Check if Neon project is active
3. Ensure network connectivity

### Sessions not working
**Solution:**
1. Check if JWT_SECRET is set in `.env`
2. Verify token is being sent in requests
3. Check token expiration

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT Best Practices](https://jwt.io/introduction)

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Review the API response in Network tab
3. Verify database connection with `npx prisma studio`
4. Check Prisma logs in terminal
