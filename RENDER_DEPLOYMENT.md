# Render Deployment Guide

## Deployment Steps

### 1. Create Backend Service on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click "New +" button → Select "Web Service"
3. Connect your GitHub repository: https://github.com/Mylena18/agenda-de-tarefas.git
4. Select branch: `main`

#### Configure Web Service:

- **Name**: `agenda-tarefas-api` (or your preferred name)
- **Environment**: `Python 3`
- **Branch**: `main`
- **Build Command**: 
  ```
  cd backend && pip install -r requirements.txt && python manage.py migrate
  ```
- **Start Command**: 
  ```
  cd backend && gunicorn setup.wsgi --log-file -
  ```

#### Environment Variables:

Click "Advanced" → "Add Environment Variable" and add:

```
DEBUG=False
SECRET_KEY=<generate-strong-secret-key-here>
ALLOWED_HOSTS=<your-app-name>.onrender.com
RENDER=True
CORS_ALLOWED_ORIGINS=https://<your-frontend-url>.onrender.com,https://<your-frontend-domain>
FRONTEND_URL=https://<your-frontend-url>
```

To generate a strong SECRET_KEY, run:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2. Create Frontend Service on Render

#### Option A: Deploy from Same Repository

1. Click "New +" → Select "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `agenda-tarefas-web`
   - **Branch**: `main`
   - **Build Command**: 
     ```
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory**: `frontend/dist`

4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://<your-app-name>.onrender.com/api/
   ```

#### Option B: Deploy to Netlify/Vercel (Alternative)

If you prefer separate deployments:
- Push frontend to separate GitHub repository or branch
- Deploy frontend via Netlify/Vercel with:
  ```
  Build Command: npm install && npm run build
  Publish Directory: dist
  Environment: VITE_API_BASE_URL=https://<your-api-url>/api/
  ```

### 3. Verify Backend Configuration

After deploying the backend, test:

```bash
# Get your backend URL from Render dashboard (e.g., https://agenda-tarefas-api.onrender.com)

# Test authentication endpoint
curl -X POST https://<your-backend-url>/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234"
  }'

# Test login
curl -X POST https://<your-backend-url>/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234"
  }'
```

### 4. Update Frontend API URL

After backend is deployed, update your Render frontend service:

1. Go to "Environment" tab
2. Update `VITE_API_BASE_URL` to your backend URL:
   ```
   VITE_API_BASE_URL=https://<your-backend-url>/api/
   ```
3. Trigger a redeploy

## Important Notes

- **First Deploy**: The first deployment takes ~5-10 minutes as dependencies are installed
- **Cold Starts**: Render free plan has ~30-second cold starts if idle for 15 minutes
- **Static Files**: WhiteNoise automatically serves Django admin static files
- **Database**: App uses SQLite (database resets on redeploy). For production, consider PostgreSQL
- **Database Reset**: After each deploy, the SQLite database is reset. Create a superuser manually or via script

## Production Checklist

- [ ] SECRET_KEY generated and securely stored in Render environment
- [ ] DEBUG set to False
- [ ] ALLOWED_HOSTS configured with your domain
- [ ] CORS_ALLOWED_ORIGINS includes your frontend URL
- [ ] Backend URL accessible and returns 200 on /api/auth/me/
- [ ] Frontend can register and login
- [ ] Tasks create and update correctly
- [ ] Environment variables match between services

## Monitoring

View logs in Render dashboard:
- Backend logs: Dashboard → Your Web Service → Logs
- Frontend logs: Dashboard → Your Static Site → Logs

## Custom Domain (Optional)

1. Go to Web Service settings
2. Under "Custom Domains", add your domain
3. Add DNS records as instructed by Render

## Troubleshooting

**"Module not found" error**: Ensure all dependencies are in `requirements.txt`

**CORS errors**: Check `CORS_ALLOWED_ORIGINS` environment variable matches your frontend URL

**API 500 errors**: Check backend logs in Render dashboard

**Frontend not connecting**: Verify `VITE_API_BASE_URL` environment variable is set correctly
