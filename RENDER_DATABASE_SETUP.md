# Setting Up PostgreSQL Database on Render.com

## Prerequisites
- Render.com account (should already have one from web service setup)
- Logged in to Render.com

---

## Step 1: Create PostgreSQL Database

### 1.1: Navigate to Render Dashboard
1. Go to [Render.com](https://render.com/)
2. Click **Dashboard** (top right)
3. Click **New +** button (top left)
4. Select **PostgreSQL**

### 1.2: Configure Database

Fill in the form with these details:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `todo-db` | Can be any name |
| **Database** | `tododb` | Must match your docker-compose.yml |
| **User** | `postgres` | Standard Postgres user |
| **Region** | Same as web service | For lower latency |
| **PostgreSQL Version** | 15 | Latest stable |
| **Plan** | Free | ✅ Free tier available |

### 1.3: Create Database
- Click **Create Database**
- Wait 2-3 minutes for provisioning

---

## Step 2: Get Database Connection Details

### 2.1: Find Connection String
After the database is created:

1. Go to your database page
2. Look for **Connections** section
3. Find the **Internal Database URL** - this is what your app will use inside Render

**Format:**
```
postgres://postgres:{PASSWORD}@{HOST}:{PORT}/{DATABASE}
```

### 2.2: Copy Connection Info
You'll need:
- **Host** (e.g., `dpg-xxx.postgres.render.com`)
- **Port** (usually `5432`)
- **Database** (e.g., `tododb`)
- **User** (e.g., `postgres`)
- **Password** (shown on page, save it!)

---

## Step 3: Update Your Backend Service

### 3.1: Add Environment Variables to Web Service

Go back to your **todo-app-frontend** service (or backend if you have one):

1. Click **Settings** (top right)
2. Scroll to **Environment**
3. Add these variables:

```
DATABASE_URL=postgres://postgres:{PASSWORD}@{HOST}:5432/tododb
DB_HOST={HOST}
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD={PASSWORD}
DB_NAME=tododb
```

**Replace:**
- `{PASSWORD}` = Your database password
- `{HOST}` = Your database host

Example:
```
DATABASE_URL=postgres://postgres:mypassword123@dpg-abc123.postgres.render.com:5432/tododb
```

### 3.2: Save Environment Variables
- Click **Save**
- Render will automatically redeploy with new variables

---

## Step 4: Update Backend Code (if needed)

### 4.1: Check Your Connection Code

Make sure your `backend/server.js` uses environment variables:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tododb',
});
```

### 4.2: Also Update docker-compose.yml (local testing)

```yaml
environment:
  DATABASE_URL: postgres://postgres:password@db:5432/tododb
  DB_HOST: db
  DB_PORT: 5432
  DB_USER: postgres
  DB_PASSWORD: password
  DB_NAME: tododb
```

---

## Step 5: Initialize Database (If Needed)

If your application needs to create tables on startup, make sure:

1. **Option A:** Your app automatically creates tables on connection
   - Add initialization script to `backend/server.js`

2. **Option B:** Run migrations manually
   - Connect to Render database using pgAdmin or psql
   - Execute your SQL scripts

### Example initialization in Node.js:

```javascript
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
};

initializeDatabase();
```

---

## Step 6: Test Database Connection

### 6.1: Check Backend Logs
1. Go to your web service on Render
2. Click **Logs** (top)
3. Look for database connection messages
4. Should show: `✅ Database initialized` or `Connected to database`

### 6.2: Test from Frontend
1. Try using your frontend application
2. Test database operations (create, read, update, delete todos)
3. Verify data persists

---

## Connection URLs Reference

### Local Development (docker-compose)
```
postgres://postgres:password@db:5432/tododb
```

### Render Production (Internal)
```
postgres://postgres:{PASSWORD}@{RENDER_HOST}:5432/tododb
```

### For psql CLI Connection
```bash
psql -U postgres -h {RENDER_HOST} -d tododb -p 5432
```

---

## GitHub Secrets to Add (Optional but Recommended)

If you want to store database credentials as GitHub Secrets:

Go to **GitHub → Settings → Secrets and variables → Actions**

Add:
```
DB_HOST={RENDER_HOST}
DB_PASSWORD={YOUR_PASSWORD}
DATABASE_URL=postgres://postgres:{PASSWORD}@{HOST}:5432/tododb
```

Then reference in your workflow if you need to run migrations during deployment.

---

## Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database name: `tododb`
- [ ] Connection details saved
- [ ] Environment variables added to web service
- [ ] Backend code uses environment variables
- [ ] Database connection tested
- [ ] Tables are created successfully
- [ ] Data persists after redeployment

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection timeout | Check Render network settings, ensure database is in same region |
| "Authentication failed" | Verify username, password, and host in connection string |
| "Database doesn't exist" | Create `tododb` database or check name matches environment |
| Tables not created | Add initialization script to backend startup code |
| Data lost after redeploy | Ensure database is separate service (not part of web service) |

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│     Render Dashboard                │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Web Service (Frontend)       │   │
│  │  - Port: 80                   │   │
│  └──────────────────────────────┘   │
│            ↓ (connects to)            │
│  ┌──────────────────────────────┐   │
│  │  PostgreSQL Database          │   │
│  │  - Port: 5432                 │   │
│  │  - User: postgres             │   │
│  │  - Database: tododb           │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

Done! Your database is ready for production. 🎉

