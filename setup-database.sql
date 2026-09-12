-- Create Tables for ProDriver Token System
-- Run this in Vercel Postgres SQL Editor

-- 1. Product Table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "apkUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "version" TEXT,
    "size" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Token Table
CREATE TABLE IF NOT EXISTS "Token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL UNIQUE,
    "productId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Token_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 3. Download Table
CREATE TABLE IF NOT EXISTS "Download" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Download_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Download_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. Payment Table
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "slipImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "tokenId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. Settings Table
CREATE TABLE IF NOT EXISTS "Settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS "Token_token_idx" ON "Token"("token");
CREATE INDEX IF NOT EXISTS "Token_productId_idx" ON "Token"("productId");
CREATE INDEX IF NOT EXISTS "Download_tokenId_idx" ON "Download"("tokenId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Payment_productId_idx" ON "Payment"("productId");

-- Insert sample product (Optional)
INSERT INTO "Product" (
    "id",
    "name",
    "shortDescription",
    "description",
    "features",
    "price",
    "apkUrl",
    "category",
    "version",
    "size"
) VALUES (
    'prod_sample_001',
    'Sample MOD APK',
    'ตัวอย่างสินค้าทดสอบ',
    'นี่คือสินค้าตัวอย่างสำหรับทดสอบระบบ',
    '["ฟีเจอร์ 1","ฟีเจอร์ 2","ฟีเจอร์ 3"]',
    99.00,
    'https://example.com/sample.apk',
    'Games',
    '1.0.0',
    '50 MB'
) ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database tables created successfully!' as status;
