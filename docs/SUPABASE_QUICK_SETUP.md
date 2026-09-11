# Supabase Quick Setup Script

## 🚀 Auto-Setup Supabase for ProDriver

This script helps you set up Supabase database automatically.

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **New Project**
3. Fill in:
   ```
   Organization: Your organization
   Name: ProDriver
   Database Password: [Generate strong password]
   Region: Southeast Asia (Singapore)
   ```
4. Click **Create new project**
5. Wait 2-3 minutes

### Step 2: Get Connection String

After project is ready:
1. Settings → Database
2. Connection string → **URI**
3. Copy the string
4. Replace `[YOUR-PASSWORD]` with your actual password

Example:
```
postgresql://postgres.abcdefghijk:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### Step 3: Run SQL Migration

1. Go to **SQL Editor** in Supabase
2. Click **New query**
3. Paste this SQL:

```sql
-- Drop existing tables if any (optional, for clean setup)
DROP TABLE IF EXISTS "License" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Product table
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create License table
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");
CREATE INDEX "License_key_idx" ON "License"("key");
CREATE INDEX "License_userId_idx" ON "License"("userId");
CREATE INDEX "License_deviceId_idx" ON "License"("deviceId");

-- Add foreign keys
ALTER TABLE "License" ADD CONSTRAINT "License_productId_fkey" 
    FOREIGN KEY ("productId") REFERENCES "Product"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "License" ADD CONSTRAINT "License_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert sample data (optional)
-- Uncomment to add test data

-- INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
-- VALUES 
--   ('user_1', 'admin@prodriver.com', 'Admin', '$2a$10$YourHashedPasswordHere', 'admin', NOW(), NOW()),
--   ('user_2', 'test@test.com', 'Test User', '$2a$10$YourHashedPasswordHere', 'user', NOW(), NOW());

-- INSERT INTO "Product" ("id", "name", "description", "features", "price", "downloadUrl", "category", "isActive", "createdAt", "updatedAt")
-- VALUES 
--   ('prod_1', 'ProDriver Premium', 'Premium mod APK', '["Feature 1","Feature 2","Feature 3"]', 299.00, 'https://example.com/download', 'premium', true, NOW(), NOW());

-- INSERT INTO "License" ("id", "key", "productId", "userId", "isActivated", "createdAt", "updatedAt")
-- VALUES 
--   ('lic_1', 'ABCD-EFGH-IJKL-MNOP', 'prod_1', 'user_2', false, NOW(), NOW());
```

4. Click **Run** (Ctrl + Enter)
5. Check for ✅ Success message

### Step 4: Update Vercel Environment Variables

1. Go to Vercel Dashboard → ProDriver
2. Settings → Environment Variables
3. Add or update:

```
DATABASE_URL = postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

Make sure to select:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 5: Redeploy

1. Deployments → Latest deployment
2. Click **...** menu → **Redeploy**
3. Wait 2-3 minutes
4. Check https://prodriver.vercel.app

---

## ✅ Verification

After deployment, test these endpoints:

1. **Homepage**: https://prodriver.vercel.app/
2. **API**: https://prodriver.vercel.app/api/products
3. **Admin**: https://prodriver.vercel.app/admin/login

---

## 🎯 Complete Environment Variables List

Make sure you have ALL of these in Vercel:

```env
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-32-character-secret-key-minimum
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhI...
TELEGRAM_CHAT_ID=123456789
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_APP_URL=https://prodriver.vercel.app
```

---

## 🆘 Still Not Working?

### Check Supabase Connection
```bash
# Test connection locally
echo "DATABASE_URL=postgresql://..." > .env
npx prisma db push
```

### Check Vercel Logs
1. Vercel → Functions → View Logs
2. Look for error messages
3. Common errors:
   - P1001: Can't reach database
   - P1012: Schema validation error
   - Connection timeout

### Force Rebuild
1. Settings → General → Clear Build Cache
2. Redeploy

---

## 💡 Pro Tips

- Use **Table Editor** in Supabase to view/edit data
- Use **SQL Editor** to run queries
- Enable **Row Level Security** for production
- Set up **Database Backups** in Supabase

---

**Setup should take 5-10 minutes total. Let me know if you need help!** 🚀
