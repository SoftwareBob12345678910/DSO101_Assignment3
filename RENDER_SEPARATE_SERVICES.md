# Render Deployment: Backend & Frontend Setup

## Your Architecture
You have:
- **Frontend:** React app (port 80 via Nginx)
- **Backend:** Node.js API (port 5000)
- **Database:** PostgreSQL

---

## Render Options

### Option 1: Separate Web Services (Recommended for Your Setup)
Create **2 separate web services** on Render:

1. **Frontend Web Service**
   - Image: `docker.io/{DOCKERHUB_USERNAME}/todo-frontend:latest`
   - Port: 80
   - Name: `todo-app-frontend`

2. **Backend Web Service**
   - Image: `docker.io/{DOCKERHUB_USERNAME}/todo-backend:latest`
   - Port: 5000
   - Name: `todo-app-backend`

3. **Database**
   - PostgreSQL service
   - Already created ✅

**Pros:**
- ✅ Simple to set up
- ✅ Each service can be restarted independently
- ✅ Easy to debug
- ✅ Recommended for beginners

**Cons:**
- Deploy each separately

---

### Option 2: Blueprint (Advanced)
Use a single Blueprint to deploy all services together.

**Pros:**
- Deploy all services at once
- Like `docker-compose.yml` for Render

**Cons:**
- More complex configuration
- Need to write YAML

---

## ✅ Recommended: Separate Web Services

For your assignment, follow this setup:

### Step 1: Frontend Service (Already Done?)
Check if you have this:
- Service name: `todo-app-frontend`
- Image: `docker.io/{USERNAME}/todo-frontend:latest`
- Port: 80
- Status: Live

### Step 2: Create Backend Service

1. Go to [Render Dashboard](https://render.com/)
2. Click **New +** → **Web Service**
3. Select **Deploy an existing image**
4. Fill in:

| Field | Value |
|-------|-------|
| **Image URL** | `docker.io/{DOCKERHUB_USERNAME}/todo-backend:latest` |
| **Service Name** | `todo-app-backend` |
| **Region** | Same as frontend (Oregon recommended) |
| **Plan** | Free |

5. Click **Create Web Service**
6. Wait 2-3 minutes

### Step 3: Add Environment Variables to Backend Service

1. Click your backend service
2. Click **Settings** (top right)
3. Scroll to **Environment**
4. Add:

```
DATABASE_URL=postgresql://tododb_zhnn_user:5ajvtNf8jpr6GhbZd6WLjVTd0TqHszTi@dpg-d82a11hkh4rs73c1pgrg-a/tododb_zhnn
PORT=5000
NODE_ENV=production
```

5. Click **Save**

### Step 4: Frontend Needs to Know Backend URL

In your frontend, you need to update API calls to point to the backend service:

**Update `frontend/src/App.js` or API config:**

```javascript
// Change from localhost to Render backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://todo-app-backend.onrender.com';

// Use in API calls:
fetch(`${API_BASE_URL}/api/todos`)
```

Or add to `frontend/.env.production`:

```
REACT_APP_API_URL=https://todo-app-backend.onrender.com
```

**Replace `todo-app-backend` with your actual backend service name from Render.**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              Render Dashboard                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Frontend Web Service                        │  │
│  │  - todo-app-frontend                         │  │
│  │  - Port: 80                                  │  │
│  │  - URL: https://todo-app-frontend.onrender.com│ │
│  └──────────────────────────────────────────────┘  │
│            ↓ (makes API calls to)                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  Backend Web Service                         │  │
│  │  - todo-app-backend                          │  │
│  │  - Port: 5000                                │  │
│  │  - URL: https://todo-app-backend.onrender.com  │ │
│  └──────────────────────────────────────────────┘  │
│            ↓ (connects to)                           │
│  ┌──────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                         │  │
│  │  - tododb_zhnn                               │  │
│  │  - Host: dpg-d82a11hkh4rs73c1pgrg-a.oregon  │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## GitHub Actions Webhook

Your current workflow triggers **one** Render webhook (frontend).

If you want to also trigger backend redeploy, add another secret:

**In GitHub → Settings → Secrets → Add:**
- Name: `RENDER_BACKEND_WEBHOOK_URL`
- Value: (backend service deploy hook from Render)

**Update `.github/workflows/deploy.yml`:**

```yaml
# 5. Trigger Frontend Deployment
- name: Trigger Frontend Deployment
  run: |
    curl -X POST ${{ secrets.RENDER_DEPLOY_WEBHOOK_URL }}

# 6. Trigger Backend Deployment
- name: Trigger Backend Deployment
  run: |
    curl -X POST ${{ secrets.RENDER_BACKEND_WEBHOOK_URL }}
```

---

## Checklist

- [ ] Frontend web service created and running
- [ ] Backend web service created
- [ ] Backend has DATABASE_URL environment variable
- [ ] Frontend knows backend URL (API_BASE_URL)
- [ ] Database is connected to backend
- [ ] Test data flows: Frontend → Backend → Database

---

## Testing

1. **Get Backend URL** from Render service page
   - Format: `https://todo-app-backend.onrender.com`

2. **Test Backend directly**:
   ```bash
   curl https://todo-app-backend.onrender.com/api/todos
   ```

3. **Update Frontend** to use this URL

4. **Test Frontend**:
   - Go to frontend URL
   - Try creating a todo
   - Data should save to database

---

## Summary

✅ **For your assignment:**
- **1 Frontend Web Service** (Nginx + React)
- **1 Backend Web Service** (Node.js API)
- **1 PostgreSQL Database** (already have)
- **2 Webhooks in GitHub Actions** (optional but recommended)

This is the standard way to deploy separate services on Render.

