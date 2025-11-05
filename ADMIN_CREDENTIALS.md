# 🔐 Admin Login Credentials

## Database Status
✅ Database Connected to Neon PostgreSQL
✅ Tables Created (Users, Sessions, PasswordResets, Branches)
✅ Admin User Created

---

## 👤 Admin Login Details

### **Super Admin Account**
- **Username:** `admin`
- **Email:** `admin@echannelling.lk`
- **Password:** `admin123`
- **2FA Code:** `123456`
- **Role:** `superadmin`

### **Regular User Account** (for testing)
- **Username:** `user`
- **Email:** `user@echannelling.lk`
- **Password:** `user123`
- **2FA Code:** `123456`
- **Role:** `user`

---

## 🚀 How to Login

1. **Start the development server:**
   ```powershell
   pnpm dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000/login
   ```

3. **Enter credentials:**
   - Username: `admin`
   - Password: `admin123`
   - 2FA Code: `123456`

4. **Click Login** ✅

---

## 🔄 What Happens During Login

1. Form submits to `/api/auth/login`
2. Server checks username/email in Neon database
3. Password verified using bcrypt
4. 2FA code validated
5. JWT token generated
6. Session saved to database
7. User redirected to dashboard with token

---

## 📊 Created Sample Data

### **Branches:**
1. **Colombo Branch**
   - Address: 123 Galle Road
   - City: Colombo
   - Manager: Admin User

2. **Kandy Branch**
   - Address: 456 Peradeniya Road
   - City: Kandy
   - Manager: Regular User

---

## 🛠️ Testing Commands

### View database in browser:
```powershell
npx prisma studio
```

### Check database connection:
```powershell
npx prisma db pull
```

### Reset database (⚠️ WARNING: Deletes all data):
```powershell
npx prisma migrate reset
```

---

## 🔐 Security Features Active

✅ **Password Hashing** - All passwords stored with bcrypt
✅ **JWT Authentication** - Secure token-based auth
✅ **Session Management** - Sessions tracked in database
✅ **2FA Ready** - Framework for two-factor authentication
✅ **SQL Injection Protection** - Prisma parameterized queries
✅ **Token Expiration** - Tokens expire after 7 days

---

## 🎯 Next Steps

1. ✅ **Login with admin credentials** - Test the authentication
2. 📧 **Configure Email Service** - For sending OTP codes (currently logged to console)
3. 🔐 **Enhance 2FA** - Integrate with authenticator apps (Google Authenticator, Authy)
4. 👥 **Add User Management** - Create UI for managing users
5. 🔒 **Add Middleware** - Protect dashboard routes
6. 📱 **Add SMS Service** - For OTP via SMS

---

## 📱 Quick Test

```powershell
# 1. Start server
pnpm dev

# 2. In another terminal, test login API:
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin123\",\"twoFA\":\"123456\"}'
```

---

## 🆘 Troubleshooting

### Can't login?
- Check console for errors
- Verify database connection: `npx prisma studio`
- Ensure dev server is running: `pnpm dev`

### Wrong credentials error?
- Username: `admin` (lowercase)
- Password: `admin123`
- 2FA: `123456`

### Database issues?
- Check `.env` DATABASE_URL is correct
- Run: `npx prisma db push`

---

**🎉 You're all set! The admin credentials are ready to use!**
