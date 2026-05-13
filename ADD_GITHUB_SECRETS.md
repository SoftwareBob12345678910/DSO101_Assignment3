    # Add GitHub Secrets - Step by Step Guide

## Overview
You need to add 3 secrets to GitHub so the CI/CD workflow can access DockerHub and Render.

---

## Secret 1: DOCKERHUB_USERNAME

### Step 1: Get Your DockerHub Username
1. Go to [DockerHub.com](https://hub.docker.com/)
2. Login with your account
3. Click your **Profile** (top right)
4. Your username is displayed at the top

### Step 2: Add to GitHub
1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** (left sidebar)
4. Click **Actions**
5. Click **New repository secret**
6. Fill in:
   - **Name:** `DOCKERHUB_USERNAME`
   - **Secret:** (your DockerHub username)
7. Click **Add secret**

✅ Example: If your DockerHub username is `myusername`, add exactly that.

---

## Secret 2: DOCKERHUB_TOKEN

### Step 1: Generate DockerHub Access Token
1. Go to [DockerHub.com](https://hub.docker.com/)
2. Login
3. Click your **Profile** (top right)
4. Click **Account Settings**
5. Click **Security** (left sidebar)
6. Click **New Access Token**
7. Fill in:
   - **Token name:** `github-actions`
   - **Access permissions:** Keep default (Read & Write)
8. Click **Create**
9. **COPY THE TOKEN** - You won't see it again! 📋

### Step 2: Add to GitHub
1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Fill in:
   - **Name:** `DOCKERHUB_TOKEN`
   - **Secret:** (paste the token you just copied)
6. Click **Add secret**

✅ Example format: `dckr_pat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

## Secret 3: RENDER_DEPLOY_WEBHOOK_URL

### Step 1: Get Webhook URL from Render
1. Go to [Render Dashboard](https://render.com/)
2. Click your **todo-app-frontend** service
3. Click **Settings** (top right)
4. Scroll down to **Deploy Hook** section
5. **COPY THE WEBHOOK URL** 📋

Format: `https://api.render.com/deploy/{RENDER_SERVICE_ID}?key={DEPLOY_KEY}`

### Step 2: Add to GitHub
1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Fill in:
   - **Name:** `RENDER_DEPLOY_WEBHOOK_URL`
   - **Secret:** (paste the webhook URL)
6. Click **Add secret**

✅ Example: `https://api.render.com/deploy/srv-abc123xyz@deploy?key=xyz123abc`

---

## Verification Checklist

After adding all 3 secrets, verify they exist:

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. You should see 3 secrets listed:
   - [ ] `DOCKERHUB_USERNAME`
   - [ ] `DOCKERHUB_TOKEN`
   - [ ] `RENDER_DEPLOY_WEBHOOK_URL`

---

## What These Secrets Do

| Secret | Used For | Example |
|--------|----------|---------|
| `DOCKERHUB_USERNAME` | Logging into DockerHub | `myusername` |
| `DOCKERHUB_TOKEN` | Authentication token | `dckr_pat_xxxxx` |
| `RENDER_DEPLOY_WEBHOOK_URL` | Triggering Render redeployment | `https://api.render.com/deploy/...` |

---

## After Adding Secrets

1. **Push a change** to trigger the workflow:
   ```bash
   git add .
   git commit -m "Trigger CI/CD workflow"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to **Actions** tab
   - Watch the workflow run
   - All steps should turn ✅ green

3. **Check DockerHub**:
   - Your images should be pushed
   - You should see `todo-backend:latest` and `todo-frontend:latest`

4. **Check Render**:
   - Your service should redeploy
   - Check **Events** for successful deployment

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow fails at "Login to DockerHub" | Check DOCKERHUB_USERNAME and DOCKERHUB_TOKEN are correct |
| "Secret not found" error | Verify secret names are EXACT (case-sensitive) |
| Render deployment doesn't trigger | Verify RENDER_DEPLOY_WEBHOOK_URL is correct |
| Images not pushed to DockerHub | Check DockerHub token hasn't expired, regenerate if needed |

---

## Done! ✅

Once all 3 secrets are added, your CI/CD pipeline is complete and will:
1. Build Docker images on every push
2. Push to DockerHub automatically
3. Trigger Render redeployment automatically

