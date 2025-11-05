-- SQL Query to View Admin Credentials in Neon Database
-- Run this in Neon Console SQL Editor: https://console.neon.tech

-- View the admin user record
SELECT 
  id,
  username,
  email,
  name,
  role,
  phone,
  isActive,
  twoFAEnabled,
  createdAt,
  updatedAt
FROM users
WHERE username = 'admin';

-- Expected Result:
-- username: admin
-- email: admin@echannelling.lk
-- name: Admin User
-- role: superadmin
-- isActive: true

---------------------------------------------------

-- View ALL users in the database
SELECT 
  username,
  email,
  name,
  role,
  isActive
FROM users
ORDER BY createdAt DESC;

---------------------------------------------------

-- View admin's password hash (to prove it's encrypted)
SELECT 
  username,
  LEFT(password, 30) as password_hash_preview
FROM users
WHERE username = 'admin';

-- The password field shows: $2a$10$...
-- This is the bcrypt hashed version of "admin123"
-- The actual password is NEVER stored in plain text

---------------------------------------------------

-- View admin's active sessions (after login)
SELECT 
  s.id as session_id,
  s.token,
  s.expiresAt,
  s.createdAt,
  u.username,
  u.name
FROM sessions s
JOIN users u ON s."userId" = u.id
WHERE u.username = 'admin';

---------------------------------------------------

-- View branches managed by admin
SELECT 
  b.name as branch_name,
  b.city,
  b.phone,
  b.isActive,
  u.name as manager_name,
  u.email as manager_email
FROM branches b
JOIN users u ON b."managerId" = u.id
WHERE u.username = 'admin';
