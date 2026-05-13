# Configure Your Backend with Render Database

## Your Database Credentials

| Item | Value |
|------|-------|
| **Internal URL** (use in Render) | `postgresql://tododb_zhnn_user:5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi@dpg-d82a11hkh4rs73c1pgrg-a/tododb_zhnn` |
| **External URL** (for external tools) | `postgresql://tododb_zhnn_user:5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi@dpg-d82a11hkh4rs73c1pgrg-a.oregon-postgres.render.com/tododb_zhnn` |
| **Host** | `dpg-d82a11hkh4rs73c1pgrg-a.oregon-postgres.render.com` |
| **Port** | `5432` |
| **Database** | `tododb_zhnn` |
| **Username** | `tododb_zhnn_user` |
| **Password** | `5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi` |

---

## Step 1: Update Your Backend Code

### 1.1: Modify `backend/server.js`

Update your database connection to use environment variables:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('✅ Connected to database');
});

module.exports = pool;
```

### 1.2: Local Testing (docker-compose)

Update `backend/.env`:

```
DATABASE_URL=postgresql://postgres:password@db:5432/tododb
NODE_ENV=development
```

Update `docker-compose.yml`:

```yaml
backend:
  build: ./backend
  ports:
    - "5000:5000"
  environment:
    DATABASE_URL: postgresql://postgres:password@db:5432/tododb
    NODE_ENV: development
  depends_on:
    - db
```

---

## Step 2: Add Environment Variables to Render

### 2.1: Go to Your Web Service on Render

1. Go to [Render Dashboard](https://render.com/)
2. Click your **todo-app-frontend** service
3. Click **Settings** (top right)

### 2.2: Add Environment Variables

Scroll to **Environment** section and add:

```
DATABASE_URL=postgresql://tododb_zhnn_user:5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi@dpg-d82a11hkh4rs73c1pgrg-a/tododb_zhnn
DB_HOST=dpg-d82a11hkh4rs73c1pgrg-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=tododb_zhnn_user
DB_PASSWORD=5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi
DB_NAME=tododb_zhnn
NODE_ENV=production
```

### 2.3: Save Environment Variables

- Click **Save**
- Render will redeploy automatically with new variables
- Wait 2-3 minutes for redeployment

---

## Step 3: Initialize Database Tables

Add this to your `backend/server.js` on startup:

```javascript
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Todos table created or already exists');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
};

// Call on server start
initializeDatabase();
```

---

## Step 4: Test the Connection

### 4.1: Check Render Logs

1. Go to your service on Render
2. Click **Logs** (top)
3. Look for: `✅ Connected to database`
4. This confirms your connection is working

### 4.2: Test Your API

Try creating a todo:

```bash
curl -X POST http://your-render-url/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo","description":"Testing database"}'
```

### 4.3: Verify Data Persistence

- Create a todo via your frontend
- Redeploy the app
- Verify the todo still exists ✅

---

## Step 5: Update Your GitHub Secrets (Optional)

If you want to use these in CI/CD, add to GitHub:

**GitHub → Settings → Secrets and variables → Actions**

```
RENDER_DATABASE_URL=postgresql://tododb_zhnn_user:5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi@dpg-d82a11hkh4rs73c1pgrg-a/tododb_zhnn
```

---

## Complete Backend Example

Here's a complete `backend/server.js` example:

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database error:', err);
  }
};

// API Routes

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create todo
app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initializeDatabase();
});
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection timeout | Ensure DATABASE_URL is correct, check Render logs |
| "SSL error" | Add `ssl: { rejectUnauthorized: false }` to pool config |
| Table not created | Add initialization script and restart service |
| Can't connect locally | Use docker-compose database instead, test separately |
| Data lost | Database is persistent, check logs for errors |

---

## Verification Checklist

- [ ] Environment variables added to Render service
- [ ] Service redeployed (check status is "Live")
- [ ] Logs show `✅ Connected to database`
- [ ] Tables created successfully
- [ ] Can create todos via API
- [ ] Data persists after redeployment
- [ ] Frontend can display todos from database

**All done! Your database is now connected.** 🎉

