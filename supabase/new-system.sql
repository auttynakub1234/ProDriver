-- ===================================================
-- ProDriver - Token System (No Device Lock)
-- ===================================================
-- System Flow:
-- 1. User sees products on website (card display)
-- 2. User pays via PromptPay QR or Admin creates token
-- 3. User logs in with token
-- 4. User can download APK unlimited times
-- 5. Token can be used on multiple devices
-- ===================================================

-- Drop existing tables
DROP TABLE IF EXISTS "License" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Token" CASCADE;
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "Download" CASCADE;
DROP TABLE IF EXISTS "Settings" CASCADE;

-- ===================================================
-- Create New Tables
-- ===================================================

-- Products Table (what customers buy)
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "features" TEXT NOT NULL, -- JSON array string
    "price" DOUBLE PRECISION NOT NULL,
    "apkUrl" TEXT NOT NULL, -- Direct download link
    "imageUrl" TEXT, -- Product image
    "category" TEXT NOT NULL,
    "version" TEXT, -- APK version
    "size" TEXT, -- File size (e.g., "50 MB")
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Tokens Table (for login and download - NO DEVICE LOCK)
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL, -- 8-digit token (e.g., 12345678)
    "productId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0, -- Track download count
    "lastUsedAt" TIMESTAMP(3), -- Last time token was used
    "expiresAt" TIMESTAMP(3), -- Optional expiration
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- Payments Table (track PromptPay payments)
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "slipImageUrl" TEXT, -- Payment slip screenshot
    "status" TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, rejected
    "tokenId" TEXT, -- Link to token after confirmation
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- Downloads Table (track downloads - no device restriction)
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- Settings Table (for website content)
CREATE TABLE "Settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT "Settings_pkey" PRIMARY KEY ("key")
);

-- ===================================================
-- Create Indexes
-- ===================================================

CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
CREATE INDEX "Token_productId_idx" ON "Token"("productId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_productId_idx" ON "Payment"("productId");
CREATE INDEX "Download_tokenId_idx" ON "Download"("tokenId");

-- ===================================================
-- Add Foreign Keys
-- ===================================================

ALTER TABLE "Token" ADD CONSTRAINT "Token_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Download" ADD CONSTRAINT "Download_tokenId_fkey"
    FOREIGN KEY ("tokenId") REFERENCES "Token"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Download" ADD CONSTRAINT "Download_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- ===================================================
-- Disable Row Level Security
-- ===================================================

ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Token" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Download" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" DISABLE ROW LEVEL SECURITY;

-- ===================================================
-- Insert Default Settings
-- ===================================================

INSERT INTO "Settings" ("key", "value", "description", "updatedAt")
VALUES
    ('site_title', 'ProDriver Shop', 'Website title', NOW()),
    ('site_description', 'ร้านขาย Mod APK คุณภาพสูง', 'Website description', NOW()),
    ('promptpay_number', '0812345678', 'PromptPay phone number or ID', NOW()),
    ('promptpay_name', 'ProDriver Shop', 'PromptPay account name', NOW()),
    ('contact_line', '@prodriver', 'LINE contact ID', NOW()),
    ('contact_phone', '081-234-5678', 'Contact phone number', NOW()),
    ('admin_password', '$2a$10$rQZ5YXxZ.CxGxZxYxZxYxO0', 'Admin password (bcrypt hashed)', NOW());

-- ===================================================
-- Insert Sample Products
-- ===================================================

INSERT INTO "Product" ("id", "name", "shortDescription", "description", "features", "price", "apkUrl", "imageUrl", "category", "version", "size", "isActive", "createdAt", "updatedAt")
VALUES
    ('prod_1',
     'ProDriver Premium',
     'แอปขับรถแบบ Pro ฟีเจอร์ครบ',
     'แอป ProDriver เวอร์ชัน Premium พร้อมฟีเจอร์ครบครันสำหรับมืออาชีพ รองรับทุกการใช้งาน ไม่มีโฆษณา อัปเดตตลอดชีพ',
     '["ไม่มีโฆษณา","ปลดล็อคทุกฟีเจอร์","รองรับ GPS แม่นยำ","โหมดกลางคืน","อัปเดตฟรีตลอดชีพ"]',
     299.00,
     'https://example.com/downloads/prodriver-premium.apk',
     'https://via.placeholder.com/400x300/4F46E5/ffffff?text=ProDriver+Premium',
     'premium',
     '2.5.0',
     '45 MB',
     true,
     NOW(),
     NOW()),

    ('prod_2',
     'ProDriver Basic',
     'แอปขับรถแบบพื้นฐาน เริ่มต้นดี',
     'แอป ProDriver เวอร์ชันพื้นฐาน เหมาะสำหรับผู้ใช้งานทั่วไป ครบครันด้วยฟีเจอร์สำคัญ ราคาประหยัด',
     '["ลบโฆษณาบางส่วน","ฟีเจอร์พื้นฐาน","รองรับ GPS","อัปเดต 6 เดือน"]',
     149.00,
     'https://example.com/downloads/prodriver-basic.apk',
     'https://via.placeholder.com/400x300/10B981/ffffff?text=ProDriver+Basic',
     'basic',
     '2.5.0',
     '38 MB',
     true,
     NOW(),
     NOW());

-- ===================================================
-- Sample Token (for testing)
-- ===================================================

INSERT INTO "Token" ("id", "token", "productId", "customerName", "customerPhone", "downloadCount", "createdAt", "updatedAt")
VALUES
    ('tok_sample', '12345678', 'prod_1', 'ทดสอบ ระบบ', '0812345678', 0, NOW(), NOW());

-- ===================================================
-- Verification Queries
-- ===================================================

SELECT 'Tables created successfully:' as status;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT 'Products count:' as info, COUNT(*) as count FROM "Product";
SELECT 'Settings count:' as info, COUNT(*) as count FROM "Settings";
SELECT 'Sample token:' as info, token FROM "Token" LIMIT 1;

-- ===================================================
-- Success Message
-- ===================================================

DO $$
BEGIN
    RAISE NOTICE '✅ New system setup complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Tables created:';
    RAISE NOTICE '  - Product (สินค้า)';
    RAISE NOTICE '  - Token (รหัสเข้าใช้งาน - ไม่ล็อกเครื่อง)';
    RAISE NOTICE '  - Payment (การชำระเงิน)';
    RAISE NOTICE '  - Download (ประวัติดาวน์โหลด)';
    RAISE NOTICE '  - Settings (ตั้งค่าเว็บไซต์)';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Sample data inserted:';
    RAISE NOTICE '  - 2 products';
    RAISE NOTICE '  - Sample token: 12345678';
    RAISE NOTICE '  - Default settings';
    RAISE NOTICE '';
    RAISE NOTICE '🔓 Token Features:';
    RAISE NOTICE '  - NO device lock';
    RAISE NOTICE '  - Unlimited downloads';
    RAISE NOTICE '  - Use on multiple devices';
    RAISE NOTICE '  - Track download count';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '1. Update PromptPay number in Settings';
    RAISE NOTICE '2. Upload product images';
    RAISE NOTICE '3. Configure Vercel environment variables';
    RAISE NOTICE '4. Deploy and test!';
END $$;
