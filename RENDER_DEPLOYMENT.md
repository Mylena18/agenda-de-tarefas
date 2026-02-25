# Render Deployment Guide

## Order of Deployment (A ordem é importante!)

```
1️⃣ Deploy Backend (Python/Django)
   ↓
2️⃣ Pegar a URL do backend (ex: https://agenda-tarefas-api.onrender.com)
   ↓
3️⃣ Deploy Frontend (React/Vite) COM a URL do backend
```

---

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
  cd backend && gunicorn setup.wsgi
  ```

#### Environment Variables:

Click "Advanced" → "Add Environment Variable" and add each one:

**PASSO 1: Gerar SECRET_KEY**
Execute este comando no seu terminal local:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Vai retornar algo como: `k-mp5c8_1ay2!^1rv=hx5@z8vp#6_1$o@$j+@^&f$@$1j1xvz`

**PASSO 2: Adicionar cada variável no Render**

| Variável | Valor Exato |
|----------|-------------|
| `DEBUG` | `False` |
| `SECRET_KEY` | Cole a chave gerada (ex: `k-mp5c8_1ay2!^1rv=hx5@z8vp#6_1$o@$j+@^&f$@$1j1xvz`) |
| `ALLOWED_HOSTS` | `agenda-tarefas-api.onrender.com` (substitua `agenda-tarefas-api` pelo nome que você colocou no serviço) |
| `RENDER` | `True` |
| `CORS_ALLOWED_ORIGINS` | `https://agenda-tarefas-web.onrender.com` (substitua `agenda-tarefas-web` pelo nome do frontend) |
| `FRONTEND_URL` | `https://agenda-tarefas-web.onrender.com` (mesmo valor do CORS_ALLOWED_ORIGINS) |

**EXEMPLO COMPLETO (com nomes):**
```
DEBUG=False
SECRET_KEY=k-mp5c8_1ay2!^1rv=hx5@z8vp#6_1$o@$j+@^&f$@$1j1xvz
ALLOWED_HOSTS=agenda-tarefas-api.onrender.com
RENDER=True
CORS_ALLOWED_ORIGINS=https://agenda-tarefas-web.onrender.com
FRONTEND_URL=https://agenda-tarefas-web.onrender.com
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
   VITE_API_BASE_URL=https://agenda-tarefas-api.onrender.com/api/
   ```
   (substitua `agenda-tarefas-api` pelo nome do seu backend)

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
# Exemplo com a URL real do seu backend
# Se seu backend se chama "agenda-tarefas-api", a URL será:
# https://agenda-tarefas-api.onrender.com

# Test authentication endpoint - Registrar novo usuário
curl -X POST https://agenda-tarefas-api.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@example.com",
    "password": "sua-senha123"
  }'

# Test login - Fazer login
curl -X POST https://agenda-tarefas-api.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@example.com",
    "password": "sua-senha123"
  }'

# Se retornar um "token", está funcionando!
```

### 4. Update Frontend API URL

**Importante: Só faça isso DEPOIS que o backend for deployado com sucesso!**

1. Você vai saber a URL do backend quando terminar o deploy no Render
   - Exemplo: `https://agenda-tarefas-api.onrender.com`

2. Go to your Frontend Static Site on Render → "Environment" tab

3. Update ou adicione a variável:
   ```
   VITE_API_BASE_URL=https://agenda-tarefas-api.onrender.com/api/
   ```
   (substitua `agenda-tarefas-api` pelo nome real do seu backend)

4. Click "Redeploy" para atualizar o frontend

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

---

## Quick Reference (Referência Rápida)

**Se você colocou os nomes assim:**
- Backend service name: `agenda-tarefas-api`
- Frontend service name: `agenda-tarefas-web`

**As URLs ficarão:**
- Backend: `https://agenda-tarefas-api.onrender.com`
- Frontend: `https://agenda-tarefas-web.onrender.com`

**As variáveis de ambiente ficarão:**
```
🔵 BACKEND (Web Service):
DEBUG=False
SECRET_KEY=<sua-chave-gerada>
ALLOWED_HOSTS=agenda-tarefas-api.onrender.com
RENDER=True
CORS_ALLOWED_ORIGINS=https://agenda-tarefas-web.onrender.com
FRONTEND_URL=https://agenda-tarefas-web.onrender.com

🟢 FRONTEND (Static Site):
VITE_API_BASE_URL=https://agenda-tarefas-api.onrender.com/api/
```
