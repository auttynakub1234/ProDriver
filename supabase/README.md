# Supabase Setup - Complete Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **New Project**
3. Fill in:
   - **Name**: ProDriver
   - **Database Password**: [Generate strong password - SAVE IT!]
   - **Region**: Southeast Asia (Singapore)
4. Click **Create new project**
5. Wait 2-3 minutes ⏳

---

### Step 2: Run SQL Migration

1. In Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy **ALL content** from `supabase/setup.sql`
4. Paste into SQL Editor
5. Click **Run** (Ctrl + Enter)
6. Check for ✅ Success messages

**Expected Output:**
```
✅ Database setup complete!
✅ Tables created: User, Product, License
✅ RLS disabled for all tables
✅ Ready for Prisma connection
```

---

### Step 3: Get Connection String

1. Settings → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

**Example:**
```
postgresql://postgres.abcdefghijk:MyP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

---

### Step 4: Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select **ProDriver** project
3. Settings → **Environment Variables**
4. Add or update these variables:

```env
DATABASE_URL
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

JWT_SECRET
your-super-secret-32-characters-minimum-key

TELEGRAM_BOT_TOKEN
123456789:ABCdefGhI...

TELEGRAM_CHAT_ID
123456789

ADMIN_USERNAME
admin

ADMIN_PASSWORD
your-secure-password

NEXT_PUBLIC_APP_URL
https://prodriver.vercel.app
```

**Important:** Select all environments:
- ✅ Production
- ✅ Preview
- ✅ Development

---

### Step 5: Redeploy

1. Deployments → Latest deployment
2. Click **...** → **Redeploy**
3. Wait 2-3 minutes
4. Done! 🎉

---

## 🧪 Testing

After deployment, test these URLs:

### 1. Homepage
```
https://prodriver.vercel.app/
```

### 2. API Products
```
https://prodriver.vercel.app/api/products
```

### 3. Admin Login
```
https://prodriver.vercel.app/admin/login
Username: admin
Password: (what you set)
```

---

## 🔐 Security Notes

### ✅ What's Secure:
- ✅ RLS disabled (we use JWT auth)
- ✅ API handles all authorization
- ✅ No direct database access from clients
- ✅ Connection string in Vercel env (secure)
- ✅ Passwords hashed with bcrypt

### ⚠️ Important:
- Database connection only from Vercel
- Never expose connection string in client code
- All API routes check JWT tokens

---

## 🗃️ Database Schema

```
User
├── id (PK)
├── email (unique)
├── name
├── password (bcrypt hashed)
├── role (user/admin)
└── timestamps

Product
├── id (PK)
├── name
├── description
├── features (JSON string)
├── price
├── downloadUrl
├── category
└── timestamps

License
├── id (PK)
├── key (unique)
├── productId (FK → Product)
├── userId (FK → User)
├── deviceId
├── isActivated
├── activatedAt
└── timestamps
```

---

## 🛠️ Management

### View Data
1. Supabase → **Table Editor**
2. Select table to view/edit

### Run Queries
1. Supabase → **SQL Editor**
2. Write and run SQL queries

### Sample Queries

**Count all records:**
```sql
SELECT 
    (SELECT COUNT(*) FROM "User") as users,
    (SELECT COUNT(*) FROM "Product") as products,
    (SELECT COUNT(*) FROM "License") as licenses;
```

**View all licenses:**
```sql
SELECT 
    l.key,
    p.name as product,
    u.email as user_email,
    l.isActivated,
    l.deviceId
FROM "License" l
JOIN "Product" p ON l."productId" = p.id
JOIN "User" u ON l."userId" = u.id
ORDER BY l."createdAt" DESC;
```

---

## 🆘 Troubleshooting

### Build Failed on Vercel

**Error: P1001 - Can't reach database**
```
Solution: Check DATABASE_URL is correct
```

**Error: Prisma schema doesn't match**
```
Solution: Run setup.sql again in Supabase
```

### API Returns 500 Error

1. Vercel → Functions → **View Logs**
2. Check error message
3. Usually: DATABASE_URL missing or wrong

### Connection Timeout

**Wrong connection string format**
```
❌ postgresql://...@...pooler.supabase.com:5432/postgres
✅ postgresql://...@...pooler.supabase.com:5432/postgres (with password)
```

---

## 📊 Vercel Deployment Status

Check deployment:
```
Vercel Dashboard → ProDriver → Deployments
```

Status meanings:
- 🟢 **Ready** = Success!
- 🔴 **Error** = Build failed (check logs)
- 🟡 **Building** = In progress (wait 2-3 min)

---

## ✅ Complete Checklist

Before closing:

- [ ] Supabase project created
- [ ] SQL migration run successfully
- [ ] Connection string copied
- [ ] All 7 environment variables added to Vercel
- [ ] Environments selected (Production, Preview, Development)
- [ ] Redeployed on Vercel
- [ ] Website loading at prodriver.vercel.app
- [ ] Admin login working
- [ ] API returning data

---

## 🎉 Success!

Your ProDriver system is now live at:
```
https://prodriver.vercel.app
```

**What you can do now:**
1. Login to Admin Panel
2. Create products
3. Generate license keys
4. Test activation with Android app
5. Monitor via Telegram notifications

---

**Need help? Check the error logs and let me know!** 🚀
