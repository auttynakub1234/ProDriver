-- ===================================================
-- ProDriver - Database Setup with RLS Disabled
-- ===================================================
-- This script disables Row Level Security (RLS) because:
-- 1. We use custom JWT authentication
-- 2. API handles authorization
-- 3. No direct client access to Supabase
-- ===================================================

-- Drop existing tables if any (for clean setup)
DROP TABLE IF EXISTS "License" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ===================================================
-- Create Tables
-- ===================================================

-- User Table
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

-- Product Table
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

-- License Table
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

-- ===================================================
-- Create Indexes
-- ===================================================

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");
CREATE INDEX "License_key_idx" ON "License"("key");
CREATE INDEX "License_userId_idx" ON "License"("userId");
CREATE INDEX "License_deviceId_idx" ON "License"("deviceId");

-- ===================================================
-- Add Foreign Keys
-- ===================================================

ALTER TABLE "License" ADD CONSTRAINT "License_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "License" ADD CONSTRAINT "License_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- ===================================================
-- Disable Row Level Security (RLS)
-- ===================================================
-- We disable RLS because:
-- - API uses JWT authentication
-- - No direct database access from clients
-- - Vercel environment is secure

ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "License" DISABLE ROW LEVEL SECURITY;

-- ===================================================
-- Insert Sample Data (Optional)
-- ===================================================
-- Uncomment to add test data

/*
-- Sample Admin User (password: admin123, hashed with bcrypt)
INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES
    ('usr_admin', 'admin@prodriver.com', 'Admin', '$2a$10$rQZ5YXxZ.CxGxZxYxZxYxO0', 'admin', NOW(), NOW());

-- Sample Regular User
INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES
    ('usr_test', 'test@example.com', 'Test User', '$2a$10$rQZ5YXxZ.CxGxZxYxZxYxO0', 'user', NOW(), NOW());

-- Sample Product
INSERT INTO "Product" ("id", "name", "description", "features", "price", "downloadUrl", "category", "isActive", "createdAt", "updatedAt")
VALUES
    ('prd_premium', 'ProDriver Premium', 'Premium Mod APK with all features unlocked', '["Unlimited access","No ads","Premium support","Regular updates"]', 299.00, 'https://example.com/download/premium', 'premium', true, NOW(), NOW());

-- Sample License (ABCD-EFGH-IJKL-MNOP)
INSERT INTO "License" ("id", "key", "productId", "userId", "isActivated", "createdAt", "updatedAt")
VALUES
    ('lic_sample', 'ABCD-EFGH-IJKL-MNOP', 'prd_premium', 'usr_test', false, NOW(), NOW());
*/

-- ===================================================
-- Verification Queries
-- ===================================================

-- Check tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS status (should be disabled)
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count records (should be 0 if no sample data)
SELECT
    (SELECT COUNT(*) FROM "User") as users,
    (SELECT COUNT(*) FROM "Product") as products,
    (SELECT COUNT(*) FROM "License") as licenses;

-- ===================================================
-- Success Message
-- ===================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '✅ Tables created: User, Product, License';
    RAISE NOTICE '✅ RLS disabled for all tables';
    RAISE NOTICE '✅ Ready for Prisma connection';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '1. Copy connection string from Supabase';
    RAISE NOTICE '2. Add DATABASE_URL to Vercel environment variables';
    RAISE NOTICE '3. Redeploy on Vercel';
    RAISE NOTICE '4. Test at https://prodriver.vercel.app';
END $$;
