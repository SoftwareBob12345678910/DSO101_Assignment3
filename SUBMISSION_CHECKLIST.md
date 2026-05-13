# Assignment 3 Submission Checklist

Complete these items to fulfill all assignment requirements.

---

## ✅ TASK 1: GitHub Repository Setup

- [ ] Repository is **PUBLIC** (verified on GitHub Settings)
- [ ] `backend/package.json` has scripts:
  - [ ] `npm start`
  - [ ] `npm run dev`
- [ ] `frontend/package.json` has scripts:
  - [ ] `npm start`
  - [ ] `npm run build`
- [ ] Repository link ready for submission

---

## ✅ TASK 2: Verify Dockerfiles

- [ ] `backend/Dockerfile` exists and is correct:
  - [ ] Uses Node.js LTS (18-alpine)
  - [ ] Sets working directory `/app`
  - [ ] Copies `package*.json`
  - [ ] Runs `npm install`
  - [ ] Copies application files
  - [ ] Exposes port 5000
  - [ ] Runs `npm start`
- [ ] `frontend/Dockerfile` exists and is correct:
  - [ ] Multi-stage build (builder + nginx)
  - [ ] Builds React app in stage 1
  - [ ] Copies build to nginx in stage 2
  - [ ] Exposes port 80
- [ ] Tested locally with `docker build` and `docker-compose up`
  - [ ] Backend accessible on `http://localhost:5000`
  - [ ] Frontend accessible on `http://localhost:3000`

---

## ✅ TASK 3: GitHub Actions Workflow

### Workflow File
- [ ] `.github/workflows/deploy.yml` created
- [ ] Workflow contains all required steps:
  - [ ] Checkout Repository
  - [ ] Login to DockerHub
  - [ ] Build and Push Backend Image
  - [ ] Build and Push Frontend Image
  - [ ] Trigger Render Deployment
- [ ] Workflow is triggered on `push` to `main` branch

### GitHub Secrets Added
- [ ] `DOCKERHUB_USERNAME` - added and saved
- [ ] `DOCKERHUB_TOKEN` - added and saved (NOT hardcoded in code)
- [ ] `RENDER_DEPLOY_WEBHOOK_URL` - added and saved (NOT hardcoded in code)

**✅ IMPORTANT: No credentials are hardcoded in `.yml` files**

---

## ✅ TASK 4: Render.com Deployment

- [ ] Render.com account created
- [ ] New Web Service created with:
  - [ ] Image URL: `docker.io/{DOCKERHUB_USERNAME}/todo-frontend:latest`
  - [ ] Service Name: `todo-app-frontend`
  - [ ] Plan: Free
- [ ] Service deployed successfully (shows as "Live")
- [ ] Webhook URL obtained from Render Deploy Hook
- [ ] Webhook URL added to GitHub Secrets

---

## ✅ Testing & Verification

### GitHub Actions
- [ ] Workflow runs successfully on push
- [ ] All 5 steps show green checkmarks ✅
- [ ] No errors in workflow logs

### DockerHub
- [ ] Account has public repositories
- [ ] Images successfully pushed:
  - [ ] `{DOCKERHUB_USERNAME}/todo-backend:latest`
  - [ ] `{DOCKERHUB_USERNAME}/todo-frontend:latest`
- [ ] Images are accessible (public visibility)

### Render Deployment
- [ ] Service shows "Live" status
- [ ] Recent deployment in Events tab shows success
- [ ] Application is accessible via Render URL
- [ ] Live URL is working (frontend loads)

---

## ✅ FINAL DELIVERABLES

### Submit These Items:

### 1. GitHub Repository Link
- URL: `https://github.com/{YOUR_USERNAME}/{YOUR_REPO}`
- Must include:
  - Dockerfiles (backend and frontend)
  - `.github/workflows/deploy.yml`
  - `package.json` files with proper scripts

### 2. Screenshots Required

#### Screenshot 1: Successful GitHub Actions Workflow
- Show the **Actions** tab with successful run
- Capture all green checkmarks ✅ for the 5 steps
- Show the job status as "completed successfully"

#### Screenshot 2: DockerHub Pushed Images
- Show your DockerHub repositories
- Capture both images:
  - `todo-backend:latest`
  - `todo-frontend:latest`
- Show "latest" tag and image size

#### Screenshot 3: Render.com Deployment
- Show your Render service page
- Capture:
  - Service status: "Live"
  - Recent successful deployment in Events tab
  - Live URL at the top
  - Service settings showing image URL

### 3. README.md Report
Create/update your `README.md` with:

```markdown
# Todo Application - CI/CD Assignment 3

## Project Overview
Brief description of your todo application

## GitHub Repository
[Link to your repository](https://github.com/...)

## Steps Taken

### Task 1: GitHub Setup
- Made repository public
- Verified package.json scripts

### Task 2: Dockerfiles
- Backend Dockerfile configured for Node.js
- Frontend Dockerfile with multi-stage build
- Local testing completed

### Task 3: GitHub Actions & Secrets
- Created `.github/workflows/deploy.yml`
- Configured DockerHub secrets
- Configured Render webhook

### Task 4: Render Deployment
- Created Render service
- Configured automated deployment
- Service is live at: [YOUR_RENDER_URL]

## Challenges Faced
- [List any challenges and how you solved them]
- Examples:
  - Dockerfile build errors and solutions
  - Secret configuration issues
  - Port conflicts or environment variables
  - Render deployment delays

## Learning Outcomes
- Gained experience with GitHub Actions CI/CD
- Learned Docker containerization best practices
- Understood webhook-based deployment automation
- Practiced infrastructure-as-code concepts

## Deployment Link
Live Application: [https://your-app.onrender.com](https://your-app.onrender.com)

## Screenshots
[Include the three screenshots mentioned above]
```

---

## ⚠️ Important Reminders

- ✅ **No hardcoded credentials** - All secrets stored in GitHub Secrets
- ✅ **Public repository** - Required for GitHub Actions to work
- ✅ **Branch is `main`** - Workflow triggers on main branch only
- ✅ **Dockerfiles correct** - Use specified structure and ports
- ✅ **All screenshots included** - Required for full marks
- ✅ **Report includes link** - Render deployment URL must be in README

---

## Deadline
✅ **Submission Date: 29th April**

---

Good luck with your submission! 🚀

