# 🗄️ Where Admin Credentials Are Stored in Neon

## 📍 **Exact Location**

### **Neon Database Details:**
- **Host:** `ep-royal-silence-ahlvvm0i-pooler.c-3.us-east-1.aws.neon.tech`
- **Database Name:** `neondb`
- **Schema:** `public`
- **Table:** `users`

---

## 📊 **Database Table: `users`**

### **Table Structure:**
```sql
CREATE TABLE users (
  id            TEXT PRIMARY KEY,           -- Unique user ID (CUID)
  username      TEXT UNIQUE NOT NULL,       -- Login username
  email         TEXT UNIQUE NOT NULL,       -- Email address
  password      TEXT NOT NULL,              -- Bcrypt hashed password
  name          TEXT NOT NULL,              -- Full name
  role          TEXT DEFAULT 'user',        -- User role
  phone         TEXT,                       -- Phone number
  isActive      BOOLEAN DEFAULT true,       -- Account status
  twoFASecret   TEXT,                       -- 2FA secret key
  twoFAEnabled  BOOLEAN DEFAULT false,      -- 2FA status
  createdAt     TIMESTAMP DEFAULT NOW(),    -- Created timestamp
  updatedAt     TIMESTAMP DEFAULT NOW()     -- Updated timestamp
);
```

---

## 👤 **Admin Record in Database**

### **What's Stored in the `users` Table:**

```
Row 1 (Admin User):
├── id: "clxxxxxxxxxxxxxxx" (auto-generated CUID)
├── username: "admin"
├── email: "admin@echannelling.lk"
├── password: "$2a$10$..." (hashed version of "admin123")
├── name: "Admin User"
├── role: "superadmin"
├── phone: "+94771234567"
├── isActive: true
├── twoFASecret: null
├── twoFAEnabled: false
├── createdAt: 2025-10-29 (when you ran seed)
└── updatedAt: 2025-10-29
```

---

## 🔐 **Password Hashing Example**

The password `admin123` is NOT stored as plain text. It's hashed using bcrypt:

**Plain Password:** `admin123`  
**Stored in Database:** `$2a$10$abcdefghijklmnopqrstuvwxyz1234567890...` (60 characters)

---

## 🌐 **How to View Your Data in Neon**

### **Method 1: Using Prisma Studio** (Easiest)
```powershell
npx prisma studio
```
Then open: http://localhost:5555
- Click on **"User"** model
- You'll see all users including admin

### **Method 2: Using Neon Console**
1. Go to: https://console.neon.tech
2. Select your project: `ep-royal-silence-ahlvvm0i`
3. Click **"SQL Editor"**
4. Run this query:
```sql
SELECT 
  id,
  username,
  email,
  name,
  role,
  phone,
  isActive,
  twoFAEnabled,
  createdAt
FROM users
WHERE username = 'admin';
```

### **Method 3: Using Neon's Tables View**
1. Go to: https://console.neon.tech
2. Select your project
3. Click **"Tables"** in the sidebar
4. Click on **"users"** table
5. You'll see all records including the admin user

---

## 📋 **All Tables Created in Your Neon Database**

Your Neon database has these 4 tables:

### **1. users** (Stores user credentials)
- Contains: admin, user, and any future users
- Primary data for authentication

### **2. sessions** (Stores active login sessions)
- Links to users table
- Tracks JWT tokens and expiration

### **3. password_resets** (Stores password reset requests)
- Links to users table
- Contains OTP codes for password reset

### **4. branches** (Stores branch information)
- Links to users table (manager)
- Contains: Colombo Branch, Kandy Branch

---

## 🔍 **Query Examples**

### **View Admin User:**
```sql
SELECT * FROM users WHERE username = 'admin';
```

### **View All Users:**
```sql
SELECT username, email, role, isActive FROM users;
```

### **Check Active Sessions:**
```sql
SELECT s.token, s.expiresAt, u.username 
FROM sessions s
JOIN users u ON s."userId" = u.id;
```

### **View Branches Managed by Admin:**
```sql
SELECT b.name, b.city, u.name as manager
FROM branches b
JOIN users u ON b."managerId" = u.id
WHERE u.username = 'admin';
```

---

## 🎯 **Visual Representation**

```
Neon PostgreSQL Cloud Database
└── neondb
    └── public schema
        ├── users table
        │   ├── admin (username: "admin", password: <hashed>)
        │   └── user (username: "user", password: <hashed>)
        │
        ├── sessions table
        │   └── (stores JWT tokens when users login)
        │
        ├── password_resets table
        │   └── (stores OTP codes for password reset)
        │
        └── branches table
            ├── Colombo Branch (manager: admin)
            └── Kandy Branch (manager: user)
```

---

## 🔗 **Connection String Breakdown**

Your `.env` DATABASE_URL:
```
postgresql://neondb_owner:npg_2qPwncvW8gzY@ep-royal-silence-ahlvvm0i-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Breaking it down:
- **Protocol:** `postgresql://`
- **Username:** `neondb_owner`
- **Password:** `npg_2qPwncvW8gzY`
- **Host:** `ep-royal-silence-ahlvvm0i-pooler.c-3.us-east-1.aws.neon.tech`
- **Database:** `neondb`
- **SSL Mode:** `require` (encrypted connection)

---

## 🛠️ **Tools to Access Your Neon Data**

### **1. Prisma Studio** (Local GUI)
```powershell
npx prisma studio
```
✅ Best for development
✅ Visual interface
✅ Easy to edit data

### **2. Neon Console** (Web-based)
https://console.neon.tech
✅ Official Neon interface
✅ SQL Editor
✅ Production monitoring

### **3. pgAdmin** (Desktop App)
Download from: https://www.pgadmin.org
✅ Full PostgreSQL client
✅ Advanced features

### **4. DBeaver** (Desktop App)
Download from: https://dbeaver.io
✅ Universal database tool
✅ Great visualization

---

## 📝 **Summary**

**Your admin credentials are stored in:**

| Item | Value |
|------|-------|
| **Cloud Provider** | Neon (Serverless PostgreSQL) |
| **Region** | US East (N. Virginia) |
| **Database** | `neondb` |
| **Table** | `users` |
| **Username** | `admin` |
| **Password** | Hashed with bcrypt (original: `admin123`) |
| **Access Method** | Prisma Studio or Neon Console |

---

## 🚀 **Quick Access Commands**

```powershell
# View data locally
npx prisma studio

# Pull latest schema from Neon
npx prisma db pull

# View database connection info
npx prisma db execute --stdin <<< "SELECT version();"
```

---

**🎉 Your admin credentials are safely stored in your Neon PostgreSQL database in the cloud!**
