# ⚡ Quick Configuration Steps (5-10 minutes)

## Step 1: Make Your GitHub Repository Public
1. Go to your GitHub repository
2. Click **Settings** → Scroll to "Danger Zone"
3. Click **Change repository visibility** → Select **Public** ✅

---

## Step 2: Create GitHub Secrets

Go to **GitHub → Settings → Secrets and variables → Actions**

### 2a: Add DOCKERHUB_USERNAME
- Click **New repository secret**
- Name: `DOCKERHUB_USERNAME`
- Value: Your DockerHub username
- Click **Add secret**

### 2b: Add DOCKERHUB_TOKEN
1. Go to [DockerHub.com](https://hub.docker.com/)
2. Login → Profile → **Account Settings**
3. Click **Security** (left side)
4. Click **New Access Token**
5. Name: `github-actions`
6. Click **Create**
7. Copy the token (long string)
8. Go back to GitHub → Add new secret:
   - Name: `DOCKERHUB_TOKEN`
   - Value: (paste the token)
   - Click **Add secret**

### 2c: Add RENDER_DEPLOY_WEBHOOK_URL
**Do this after Step 4 below** - Come back to add this secret

---

## Step 3: Push GitHub Actions Workflow to Repository

The workflow file is already created at:
`.github/workflows/deploy.yml`

Push it to GitHub:
```bash
git add .github/
git commit -m "Add GitHub Actions CI/CD workflow"
git push origin main
```

You should now see the workflow file in your GitHub repository.

---

## Step 4: Set Up Render.com Service

### 4a: Create Web Service
1. Go to [Render.com](https://render.com/)
2. Sign up/Login with GitHub
3. Click **New +** → **Web Service**
4. Select **Deploy an existing image**
5. Fill the form:
   - **Image URL**: `docker.io/YOUR_DOCKERHUB_USERNAME/todo-frontend:latest`
   - **Service Name**: `todo-app-frontend`
   - **Region**: Select closest to you
   - **Plan**: Free
6. Click **Create Web Service**
7. Wait 2-3 minutes for deployment

### 4b: Get Webhook URL
1. On your Render service page, click **Settings** (top right)
2. Scroll down to **Deploy Hook**
3. Copy the webhook URL
4. Go to GitHub → Settings → Secrets → Add new secret:
   - Name: `RENDER_DEPLOY_WEBHOOK_URL`
   - Value: (paste the webhook URL)
   - Click **Add secret**

---

## Step 5: Test the Pipeline

### 5a: Trigger the Workflow
Make a small change and push it:
```bash
# Make any small change to a file (e.g., add a comment)
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### 5b: Monitor GitHub Actions
1. Go to GitHub → **Actions** tab
2. Click on your workflow run
3. Watch for all green checkmarks ✅

### 5c: Check DockerHub
1. Go to [DockerHub.com](https://hub.docker.com/)
2. Check your repositories
3. You should see `todo-backend:latest` and `todo-frontend:latest`

### 5d: Check Render Deployment
1. Go to your Render service
2. Click **Events** tab
3. You should see a successful deployment
4. Your app is now live! 🚀

---

## If Something Fails

| Issue | Solution |
|-------|----------|
| GitHub Actions failed | Check the red ❌ step, click it for error details |
| Secret not found | Make sure secret names are EXACT (case-sensitive): `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_WEBHOOK_URL` |
| DockerHub push failed | Verify username is lowercase, token is correct, and hasn't expired |
| Render deployment failed | Check Render service logs, ensure webhook URL is correct |

---

## All Done! ✅

You now have:
- ✅ Automated Docker builds on every push
- ✅ Images pushed to DockerHub automatically
- ✅ Automatic deployment to Render.com
- ✅ Live application running on Render

For detailed explanations, see `CI_CD_SETUP_GUIDE.md`

