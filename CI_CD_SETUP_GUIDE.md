# CI/CD Configuration Setup Guide - Assignment 3

## Overview
This guide walks you through configuring GitHub Actions for automated CI/CD with DockerHub and Render.com deployment.

---

## TASK 1: Verify GitHub Repository Setup

### Step 1.1: Make Repository Public
1. Go to GitHub → Your repository → **Settings**
2. Under "Danger Zone", scroll to find repository visibility
3. Click **Change repository visibility** → Select **Public**
4. Confirm the change

### Step 1.2: Verify Package.json Scripts
Your `package.json` files already have the required scripts:

**Backend** (`backend/package.json`):
- ✅ `npm start` → starts the server
- ✅ `npm run dev` → development mode

**Frontend** (`frontend/package.json`):
- ✅ `npm start` → starts the React app
- ✅ `npm run build` → builds for production

**No changes needed** - your scripts are properly configured!

---

## TASK 2: Verify Dockerfiles

### Step 2.1: Verify Backend Dockerfile
Your `backend/Dockerfile` is properly configured with:
- ✅ Uses Node 18-alpine
- ✅ Sets working directory
- ✅ Copies package files
- ✅ Installs dependencies
- ✅ Copies source code
- ✅ Exposes port 5000
- ✅ Starts with `npm start`

### Step 2.2: Verify Frontend Dockerfile
Your `frontend/Dockerfile` uses multi-stage build (best practice):
- ✅ Stage 1: Builds React app
- ✅ Stage 2: Serves with Nginx
- ✅ Proper handling of React Router with nginx.conf
- ✅ Exposes port 80

**No changes needed** - both Dockerfiles are correctly configured!

### Step 2.3: Test Locally (Optional but Recommended)
Run these commands from your project root:

```bash
# Build both images
docker build -f backend/Dockerfile -t todo-backend:latest .
docker build -f frontend/Dockerfile -t todo-frontend:latest .

# Run with docker-compose
docker-compose up
```

Verify:
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

---

## TASK 3: Create GitHub Actions Workflow & Add Secrets

### Step 3.1: Create Workflow Directory
In your local repository, create the directory structure:

```
.github/
└── workflows/
    └── deploy.yml
```

### Step 3.2: Create `.github/workflows/deploy.yml`
Create this file with the following content:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. Checkout code
      - name: Checkout Repository
        uses: actions/checkout@v4

      # 2. Login to DockerHub
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      # 3. Build & Push Backend Image
      - name: Build and Push Backend Image
        run: |
          docker build -f backend/Dockerfile -t ${{ secrets.DOCKERHUB_USERNAME }}/todo-backend:latest .
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/todo-backend:latest

      # 4. Build & Push Frontend Image
      - name: Build and Push Frontend Image
        run: |
          docker build -f frontend/Dockerfile -t ${{ secrets.DOCKERHUB_USERNAME }}/todo-frontend:latest .
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/todo-frontend:latest

      # 5. Trigger Render Deployment
      - name: Trigger Render Deployment
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_WEBHOOK_URL }}
```

### Step 3.3: Add GitHub Secrets

Go to **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value | Where to Get |
|---|---|---|
| `DOCKERHUB_USERNAME` | Your DockerHub username | DockerHub account settings |
| `DOCKERHUB_TOKEN` | Your DockerHub access token | DockerHub → Account Settings → Security → New Access Token |
| `RENDER_DEPLOY_WEBHOOK_URL` | Render webhook URL | See Step 4.2 below |

#### How to Create DockerHub Access Token:
1. Go to [DockerHub](https://hub.docker.com/)
2. Login → Click your profile → **Account Settings**
3. Click **Security** (left sidebar)
4. Click **New Access Token**
5. Give it a name: `github-actions`
6. Click **Create**
7. Copy the token (you won't see it again!)
8. Add it to GitHub Secrets as `DOCKERHUB_TOKEN`

---

## TASK 4: Set Up Render.com Deployment

### Step 4.1: Create New Service on Render.com

1. Go to [Render.com](https://render.com/)
2. Sign up or login with GitHub (recommended)
3. Click **New +** → **Web Service**
4. Select **Deploy an existing image**
5. Fill in the form:

| Field | Value |
|---|---|
| **Image URL** | `docker.io/{DOCKERHUB_USERNAME}/todo-frontend:latest` |
| **Service Name** | `todo-app-frontend` |
| **Region** | Choose closest to you |
| **Plan** | Free |

6. Click **Create Web Service**
7. Wait for deployment to complete (2-3 minutes)

### Step 4.2: Get Render Webhook URL

1. On your Render service page, click **Settings** (top right)
2. Scroll down to **Deploy Hook**
3. Copy the webhook URL
4. Add it to GitHub Secrets as `RENDER_DEPLOY_WEBHOOK_URL`

**Webhook URL Format:** `https://api.render.com/deploy/{RENDER_SERVICE_ID}?key={DEPLOY_KEY}`

### Step 4.3: Configure Environment Variables (if needed)

If your app needs environment variables:

1. On Render service page → **Environment**
2. Add any required variables (e.g., `BACKEND_URL`, `DATABASE_URL`)
3. Click **Save**

---

## Complete Checklist

### Pre-Deployment
- [ ] Repository is public
- [ ] Dockerfiles are present and correct
- [ ] `package.json` has proper scripts

### GitHub Setup
- [ ] `.github/workflows/deploy.yml` created
- [ ] GitHub Secrets added:
  - [ ] `DOCKERHUB_USERNAME`
  - [ ] `DOCKERHUB_TOKEN`
  - [ ] `RENDER_DEPLOY_WEBHOOK_URL`

### DockerHub
- [ ] Account created
- [ ] Images can be pushed (public repo recommended)
- [ ] Access token generated

### Render.com
- [ ] Account created with GitHub
- [ ] Web service created
- [ ] Webhook URL obtained

---

## Testing Your CI/CD Pipeline

### Step 1: Push Changes to `main` branch
```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

### Step 2: Check GitHub Actions
1. Go to GitHub repository → **Actions** tab
2. You should see your workflow running
3. Watch for:
   - ✅ Checkout Repository
   - ✅ Login to DockerHub
   - ✅ Build and Push Backend Image
   - ✅ Build and Push Frontend Image
   - ✅ Trigger Render Deployment

### Step 3: Verify DockerHub
1. Go to [DockerHub](https://hub.docker.com/)
2. Check your repositories
3. You should see:
   - `todo-backend:latest`
   - `todo-frontend:latest`

### Step 4: Verify Render Deployment
1. Go to your Render service page
2. Check the **Events** tab for successful deployment
3. Visit the provided URL to see your app live!

---

## Troubleshooting

### GitHub Actions Fails
- Check secret names (case-sensitive)
- Verify Dockerfiles exist in correct paths
- Check workflow syntax at [GitHub Actions Docs](https://docs.github.com/en/actions)

### DockerHub Push Fails
- Verify token is correct
- Ensure username is lowercase
- Check token hasn't expired

### Render Deployment Fails
- Verify webhook URL is correct
- Check Render service logs
- Ensure ports are properly exposed

---

## Expected Outcomes

After completing this guide, you should have:

1. ✅ Automated Docker image builds on every push to `main`
2. ✅ Images automatically pushed to DockerHub
3. ✅ Automatic deployment to Render.com
4. ✅ Public GitHub repository with workflow configuration
5. ✅ Live application accessible via Render URL

