# 🚀 Guía de Despliegue y Verificación - RentOS

## 📋 Configuración para Vercel (Frontend)

### 1. Variables de Entorno en Vercel

En tu proyecto de Vercel, ve a **Settings > Environment Variables** y agrega:

```env
# REQUERIDO - URL de tu backend
NEXT_PUBLIC_API_URL=https://tu-backend-url.com

# OPCIONAL - Solo si usas OpenAI directamente desde frontend
OPENAI_API_KEY=sk-...
```

**IMPORTANTE**: 
- `NEXT_PUBLIC_API_URL` debe apuntar a donde esté desplegado tu backend
- Si el backend está en local: `http://localhost:3001`
- Si el backend está en Railway/Render/Heroku: `https://tu-backend.railway.app`
- Si el backend está en AWS/Azure: `https://api.tudominio.com`

### 2. Actualizar `.env.local.example`

```env
# Backend API URL
# Para desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:3001

# Para producción (Vercel)
# NEXT_PUBLIC_API_URL=https://tu-backend-url.com
```

## 🔧 Configuración del Backend

### Opción 1: Backend en Railway (Recomendado)

1. **Crear cuenta en Railway**: https://railway.app
2. **Nuevo proyecto**: New Project > Deploy from GitHub
3. **Seleccionar**: rentos-backend repository
4. **Variables de entorno**:

```env
DATABASE_HOST=postgres-container-name
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu-password-seguro
DATABASE_NAME=rentos_db
JWT_SECRET=tu-jwt-secret-muy-seguro-cambiar-en-produccion
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-tu-api-key-de-openai
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://tu-frontend.vercel.app
```

5. **Agregar PostgreSQL**: Add Service > Database > PostgreSQL
6. **Conectar**: Railway conectará automáticamente las variables de DB

### Opción 2: Backend en Render

1. **Crear cuenta en Render**: https://render.com
2. **New Web Service** > Connect repository
3. **Configuración**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. **Variables de entorno**: Igual que Railway
5. **Agregar PostgreSQL**: Dashboard > New > PostgreSQL

### Opción 3: Backend Local (Solo para desarrollo)

Si tu backend está en local y frontend en Vercel:

```env
# En Vercel
NEXT_PUBLIC_API_URL=http://tu-ip-publica:3001
```

**NOTA**: Necesitarás exponer tu puerto 3001 públicamente (no recomendado para producción)

## ✅ Tests de Verificación

### Test 1: Verificar Backend está corriendo

```bash
# Desde tu terminal local
curl http://localhost:3001/health

# O desde navegador
http://localhost:3001/api/docs
```

**Resultado esperado**: 
- Status 200 OK
- Swagger docs visible

### Test 2: Verificar CORS

```bash
curl -H "Origin: https://tu-frontend.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://tu-backend-url.com/vehiculos
```

**Resultado esperado**:
```
Access-Control-Allow-Origin: https://tu-frontend.vercel.app
Access-Control-Allow-Credentials: true
```

### Test 3: Verificar Endpoints API

```bash
# Test Auth
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rentos.com","password":"admin123"}'

# Test Vehiculos (sin auth)
curl http://localhost:3001/vehiculos

# Test Dashboard
curl http://localhost:3001/dashboard/metricas
```

**Resultado esperado**: JSON con datos

### Test 4: Verificar Conexión Frontend-Backend

Abre la consola del navegador en tu Vercel deployment:

```javascript
// En la consola del navegador
fetch('https://tu-backend-url.com/vehiculos')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Resultado esperado**: Array de vehículos

## 🔍 Checklist de Verificación Completa

### Backend

```bash
# 1. Verificar que el backend inicia
cd rentos-backend
npm run start:dev

# Deberías ver:
# 🚀 RentOS Backend running on: http://localhost:3001
# 📚 API Documentation: http://localhost:3001/api/docs
```

```bash
# 2. Verificar base de datos
docker ps | grep postgres
# Debería mostrar contenedor de PostgreSQL corriendo
```

```bash
# 3. Verificar seed data
npm run seed
# Debería crear usuario admin y datos iniciales
```

```bash
# 4. Test endpoints manualmente
curl http://localhost:3001/vehiculos
curl http://localhost:3001/clientes
curl http://localhost:3001/dashboard/metricas
```

### Frontend

```bash
# 1. Verificar que el frontend inicia
cd RentOS
npm run dev

# Deberías ver:
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
```

```bash
# 2. Verificar variable de entorno
cat .env.local
# Debe contener: NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
# 3. Verificar build
npm run build
# Debería compilar sin errores
```

### Integración

1. **Abrir frontend**: http://localhost:3000
2. **Abrir DevTools**: F12 > Console
3. **Navegar a Dashboard**: http://localhost:3000/dashboard
4. **Verificar Network tab**: 
   - Deberías ver requests a `http://localhost:3001/dashboard/metricas`
   - Status: 200 OK
   - Response: JSON con datos

5. **Verificar funcionalidades**:
   - [ ] Dashboard muestra métricas
   - [ ] Vehículos se cargan
   - [ ] Clientes se cargan
   - [ ] Reservas se cargan
   - [ ] Asistente IA responde (si tienes OpenAI key)

## 🐛 Troubleshooting

### Error: "Failed to fetch" en frontend

**Causa**: Backend no está corriendo o CORS mal configurado

**Solución**:
```bash
# 1. Verificar backend está corriendo
curl http://localhost:3001/vehiculos

# 2. Verificar CORS en backend
# En rentos-backend/src/main.ts debe tener:
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
});

# 3. Reiniciar backend
cd rentos-backend
docker-compose restart backend
```

### Error: "Network Error" en Vercel

**Causa**: URL del backend incorrecta o backend no accesible públicamente

**Solución**:
1. Verificar variable `NEXT_PUBLIC_API_URL` en Vercel
2. Verificar que el backend esté desplegado y accesible
3. Probar URL del backend en navegador: `https://tu-backend-url.com/vehiculos`

### Error: "CORS policy" en navegador

**Causa**: Backend no permite requests desde tu dominio de Vercel

**Solución**:
```bash
# En backend, actualizar .env
CORS_ORIGIN=https://tu-frontend.vercel.app

# O permitir múltiples orígenes en main.ts:
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://tu-frontend.vercel.app',
    'https://tu-frontend-preview.vercel.app'
  ],
  credentials: true,
});
```

### Error: "Unauthorized" en todas las requests

**Causa**: Token JWT no se está enviando o es inválido

**Solución**:
```javascript
// Verificar en consola del navegador
localStorage.getItem('rentos_token')

// Si es null, hacer login primero
// El token se guarda automáticamente después del login
```

### Frontend funciona en local pero no en Vercel

**Causa**: Variable de entorno no configurada en Vercel

**Solución**:
1. Ir a Vercel Dashboard > Tu Proyecto > Settings > Environment Variables
2. Agregar: `NEXT_PUBLIC_API_URL` = `https://tu-backend-url.com`
3. Redeploy: Deployments > Latest > Redeploy

## 📊 Script de Verificación Automática

Crea este archivo para verificar todo:

```bash
# verify-integration.sh
#!/bin/bash

echo "🔍 Verificando integración RentOS..."
echo ""

# Test 1: Backend
echo "1️⃣ Verificando backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/vehiculos)
if [ $BACKEND_STATUS -eq 200 ]; then
  echo "✅ Backend OK (Status: $BACKEND_STATUS)"
else
  echo "❌ Backend ERROR (Status: $BACKEND_STATUS)"
fi
echo ""

# Test 2: Frontend
echo "2️⃣ Verificando frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ $FRONTEND_STATUS -eq 200 ]; then
  echo "✅ Frontend OK (Status: $FRONTEND_STATUS)"
else
  echo "❌ Frontend ERROR (Status: $FRONTEND_STATUS)"
fi
echo ""

# Test 3: Database
echo "3️⃣ Verificando PostgreSQL..."
if docker ps | grep -q postgres; then
  echo "✅ PostgreSQL corriendo"
else
  echo "❌ PostgreSQL no encontrado"
fi
echo ""

# Test 4: API Endpoints
echo "4️⃣ Verificando endpoints..."
ENDPOINTS=("vehiculos" "clientes" "reservas" "tarifas" "dashboard/metricas")
for endpoint in "${ENDPOINTS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/$endpoint)
  if [ $STATUS -eq 200 ] || [ $STATUS -eq 401 ]; then
    echo "✅ /$endpoint (Status: $STATUS)"
  else
    echo "❌ /$endpoint (Status: $STATUS)"
  fi
done
echo ""

echo "🎉 Verificación completa!"
```

Ejecutar:
```bash
chmod +x verify-integration.sh
./verify-integration.sh
```

## 🎯 Configuración Recomendada para Producción

### Backend (Railway/Render)
```env
DATABASE_HOST=<auto-generado>
DATABASE_PORT=5432
DATABASE_USER=<auto-generado>
DATABASE_PASSWORD=<auto-generado>
DATABASE_NAME=rentos_db
JWT_SECRET=<generar-con-openssl-rand-base64-32>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-<tu-key>
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://rentos.vercel.app,https://rentos-preview.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://rentos-backend.railway.app
```

## 📝 Resumen de URLs

| Servicio | Desarrollo | Producción |
|----------|-----------|------------|
| Frontend | http://localhost:3000 | https://rentos.vercel.app |
| Backend | http://localhost:3001 | https://rentos-backend.railway.app |
| Swagger | http://localhost:3001/api/docs | https://rentos-backend.railway.app/api/docs |
| PostgreSQL | localhost:5432 | <railway-internal> |

## ✅ Checklist Final

- [ ] Backend desplegado y accesible
- [ ] PostgreSQL conectado y con datos seed
- [ ] Variables de entorno configuradas en backend
- [ ] CORS configurado correctamente
- [ ] Frontend desplegado en Vercel
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada en Vercel
- [ ] Tests de endpoints pasando
- [ ] Login funcional
- [ ] Dashboard muestra datos
- [ ] Asistente IA responde (si tienes OpenAI key)

---

**¿Necesitas ayuda?** Revisa los logs:
- Backend: `docker-compose logs backend`
- Frontend: Vercel Dashboard > Deployments > View Function Logs
