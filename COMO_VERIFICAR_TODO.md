# 🔍 Cómo Verificar que Todo Está Funcionando - RentOS

## 📋 Verificación Rápida (5 minutos)

### Opción 1: Script Automático (Recomendado)

#### Windows:
```bash
verify-integration.bat
```

#### Linux/Mac:
```bash
chmod +x verify-integration.sh
./verify-integration.sh
```

Este script verificará automáticamente:
- ✅ Backend corriendo
- ✅ Frontend corriendo
- ✅ PostgreSQL activo
- ✅ Todos los endpoints API
- ✅ Variables de entorno configuradas
- ✅ Swagger documentation

---

## 🔧 Verificación Manual Paso a Paso

### PASO 1: Verificar Backend

```bash
# 1.1 Ir a la carpeta del backend
cd c:\Users\buu\Downloads\rentos-backend

# 1.2 Verificar que Docker está corriendo
docker ps

# Deberías ver:
# - Contenedor de PostgreSQL
# - Contenedor de backend (si usas Docker)

# 1.3 Verificar que el backend responde
curl http://localhost:3001/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "timestamp": "2026-04-07T...",
#   "service": "RentOS Backend",
#   "version": "1.0.0",
#   "uptime": 123.45
# }
```

**Si el backend NO responde:**
```bash
# Iniciar backend con Docker
docker-compose up -d

# O iniciar en modo desarrollo
npm run start:dev
```

### PASO 2: Verificar Base de Datos

```bash
# 2.1 Verificar que PostgreSQL está corriendo
docker ps | grep postgres

# 2.2 Verificar conexión a la base de datos
docker exec -it <postgres-container-id> psql -U rentos -d rentos_db

# Dentro de psql:
\dt  # Listar tablas
\q   # Salir

# Deberías ver tablas como:
# - user
# - vehiculo
# - cliente
# - reserva
# - tarifa
# - notificacion
# - conversation
# - tenant
```

**Si no hay datos:**
```bash
# Ejecutar seed
npm run seed
```

### PASO 3: Verificar Endpoints API

```bash
# 3.1 Health check
curl http://localhost:3001/health

# 3.2 Vehículos
curl http://localhost:3001/vehiculos

# 3.3 Clientes
curl http://localhost:3001/clientes

# 3.4 Reservas
curl http://localhost:3001/reservas

# 3.5 Tarifas
curl http://localhost:3001/tarifas

# 3.6 Dashboard
curl http://localhost:3001/dashboard/metricas
```

**Todos deberían devolver JSON** (algunos pueden devolver 401 si requieren autenticación, eso es OK)

### PASO 4: Verificar Swagger Documentation

Abre en tu navegador:
```
http://localhost:3001/api/docs
```

Deberías ver:
- ✅ Interfaz de Swagger UI
- ✅ Todos los endpoints organizados por tags
- ✅ Puedes probar endpoints directamente

### PASO 5: Verificar Frontend

```bash
# 5.1 Ir a la carpeta del frontend
cd c:\Users\buu\Downloads\RentOS

# 5.2 Verificar variable de entorno
cat .env.local

# Debe contener:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# 5.3 Verificar que el frontend responde
curl http://localhost:3000
```

**Si el frontend NO responde:**
```bash
# Iniciar frontend
npm run dev

# O con Docker
docker-compose up -d
```

### PASO 6: Verificar Integración Frontend-Backend

#### 6.1 Abrir Frontend en Navegador
```
http://localhost:3000
```

#### 6.2 Abrir DevTools (F12)
- Ve a la pestaña **Network**
- Ve a la pestaña **Console**

#### 6.3 Navegar al Dashboard
```
http://localhost:3000/dashboard
```

#### 6.4 Verificar en Network Tab
Deberías ver requests a:
- `http://localhost:3001/dashboard/metricas` - Status 200
- `http://localhost:3001/vehiculos` - Status 200
- `http://localhost:3001/clientes` - Status 200

#### 6.5 Verificar en Console
NO deberías ver errores como:
- ❌ "Failed to fetch"
- ❌ "CORS policy"
- ❌ "Network Error"

Si ves estos errores, ve a la sección de Troubleshooting abajo.

### PASO 7: Verificar Funcionalidades Específicas

#### 7.1 Dashboard
```
http://localhost:3000/dashboard
```
- ✅ Muestra métricas (ingresos, flota, ocupación)
- ✅ Muestra gráfico de ingresos
- ✅ Muestra top vehículos

#### 7.2 Vehículos
```
http://localhost:3000/dashboard/vehiculos
```
- ✅ Lista de vehículos se carga
- ✅ Puedes filtrar por estado
- ✅ Puedes ver detalles de un vehículo

#### 7.3 Clientes
```
http://localhost:3000/dashboard/clientes
```
- ✅ Lista de clientes se carga
- ✅ Muestra scoring de clientes
- ✅ Puedes buscar clientes

#### 7.4 Reservas
```
http://localhost:3000/dashboard/reservas
```
- ✅ Lista de reservas se carga
- ✅ Puedes crear nueva reserva
- ✅ Verifica disponibilidad

#### 7.5 Asistente IA
```
http://localhost:3000/dashboard/asistente-ia
```
- ✅ Chat se carga
- ✅ Puedes enviar mensajes
- ✅ Recibe respuestas (mock o real según OpenAI key)

---

## 🧪 Tests de Integración

### Test 1: Login y Autenticación

```bash
# Hacer login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rentos.com","password":"admin123"}'

# Respuesta esperada:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 1,
#     "email": "admin@rentos.com",
#     "nombre": "Administrador",
#     "rol": "admin"
#   }
# }
```

### Test 2: Crear Vehículo

```bash
# Primero obtener token (del test anterior)
TOKEN="tu-token-aqui"

# Crear vehículo
curl -X POST http://localhost:3001/vehiculos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "marca": "Yamaha",
    "modelo": "MT-07",
    "anio": 2024,
    "placa": "TEST123",
    "kilometraje": 0,
    "proximoMantenimiento": 5000,
    "estado": "available",
    "tipo": "Naked",
    "precioDia": 50,
    "foto": "https://example.com/photo.jpg"
  }'

# Respuesta esperada: JSON con el vehículo creado
```

### Test 3: Calcular Precio con Tarifas

```bash
curl -X POST http://localhost:3001/tarifas/calcular-precio \
  -H "Content-Type: application/json" \
  -d '{
    "precioBase": 50,
    "fechaInicio": "2026-05-01",
    "fechaFin": "2026-05-08",
    "vehiculoId": 1
  }'

# Respuesta esperada:
# {
#   "precioBase": 50,
#   "dias": 7,
#   "subtotal": 350,
#   "descuentos": 52.5,
#   "recargos": 0,
#   "precioFinal": 297.5
# }
```

### Test 4: Chat con Asistente IA

```bash
curl -X POST http://localhost:3001/rag/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"¿Cuál es el precio de alquiler?"}'

# Respuesta esperada:
# {
#   "response": "Los precios de alquiler varían según el tipo de vehículo...",
#   "conversationId": "conv-123"
# }
```

---

## 🚨 Troubleshooting

### Problema 1: "Failed to fetch" en Frontend

**Causa**: Backend no está corriendo o URL incorrecta

**Solución**:
```bash
# 1. Verificar backend
curl http://localhost:3001/health

# 2. Verificar .env.local
cat RentOS/.env.local
# Debe tener: NEXT_PUBLIC_API_URL=http://localhost:3001

# 3. Reiniciar frontend
cd RentOS
npm run dev
```

### Problema 2: "CORS policy" Error

**Causa**: Backend no permite requests desde tu origen

**Solución**:
```bash
# 1. Verificar CORS en backend
# En rentos-backend/src/main.ts debe permitir tu origen

# 2. Reiniciar backend
cd rentos-backend
docker-compose restart backend

# O en modo dev
npm run start:dev
```

### Problema 3: Backend no conecta a PostgreSQL

**Causa**: PostgreSQL no está corriendo o credenciales incorrectas

**Solución**:
```bash
# 1. Verificar PostgreSQL
docker ps | grep postgres

# 2. Si no está corriendo
cd rentos-backend
docker-compose up -d postgres

# 3. Verificar credenciales en .env
cat .env
# DATABASE_HOST=postgres
# DATABASE_PORT=5432
# DATABASE_USER=rentos
# DATABASE_PASSWORD=rentos123
# DATABASE_NAME=rentos_db

# 4. Recrear base de datos
docker-compose down -v
docker-compose up -d
npm run seed
```

### Problema 4: Endpoints devuelven 404

**Causa**: Backend no está corriendo o rutas incorrectas

**Solución**:
```bash
# 1. Verificar que backend está corriendo
curl http://localhost:3001/health

# 2. Ver Swagger docs para rutas correctas
# Abrir: http://localhost:3001/api/docs

# 3. Verificar logs del backend
docker-compose logs backend
```

### Problema 5: Asistente IA no responde

**Causa**: OpenAI API key no configurada o inválida

**Solución**:
```bash
# 1. Verificar .env del backend
cat rentos-backend/.env
# OPENAI_API_KEY=sk-...

# 2. Si no tienes key, el sistema usa respuestas mock
# Esto es normal para desarrollo

# 3. Para obtener key de OpenAI:
# https://platform.openai.com/api-keys
```

---

## ✅ Checklist Final de Verificación

### Backend
- [ ] PostgreSQL corriendo (`docker ps | grep postgres`)
- [ ] Backend corriendo (`curl http://localhost:3001/health`)
- [ ] Swagger docs accesible (`http://localhost:3001/api/docs`)
- [ ] Endpoints responden (`curl http://localhost:3001/vehiculos`)
- [ ] Datos seed cargados (`npm run seed`)
- [ ] Variables de entorno configuradas (`.env` existe)

### Frontend
- [ ] Frontend corriendo (`curl http://localhost:3000`)
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada (`.env.local`)
- [ ] Dashboard carga sin errores
- [ ] Network tab muestra requests exitosos
- [ ] Console sin errores de CORS

### Integración
- [ ] Dashboard muestra métricas reales
- [ ] Vehículos se cargan desde API
- [ ] Clientes se cargan desde API
- [ ] Reservas se cargan desde API
- [ ] Asistente IA responde
- [ ] Login funcional

### Tests
- [ ] Backend tests pasan (`npm run test` en rentos-backend)
- [ ] Frontend tests pasan (`npm run test` en RentOS)

---

## 📊 Resultado Esperado

Si todo está bien, deberías ver:

```
✅ Backend OK (Status: 200)
✅ Frontend OK (Status: 200)
✅ PostgreSQL corriendo
✅ /vehiculos (Status: 200)
✅ /clientes (Status: 200)
✅ /reservas (Status: 200)
✅ /tarifas (Status: 200)
✅ /dashboard/metricas (Status: 200)
✅ NEXT_PUBLIC_API_URL configurado
✅ Backend .env encontrado
✅ Swagger docs disponible

🎉 ¡Todo está funcionando correctamente!
```

---

## 🎯 Para Vercel Deployment

Si tu frontend está en Vercel:

1. **Configurar variable de entorno en Vercel**:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings > Environment Variables
   - Agrega: `NEXT_PUBLIC_API_URL` = `https://tu-backend-url.com`
   - Redeploy

2. **Verificar desde Vercel**:
   - Abre tu app en Vercel: `https://tu-app.vercel.app`
   - Abre DevTools (F12) > Network
   - Navega al dashboard
   - Verifica que las requests van a tu backend URL
   - Verifica que no hay errores de CORS

3. **Configurar CORS en Backend**:
   ```env
   # En rentos-backend/.env
   CORS_ORIGIN=https://tu-app.vercel.app
   ```

Ver guía completa: [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)

---

**¿Necesitas más ayuda?** Revisa:
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Guía de integración completa
- [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) - Despliegue en Vercel
- [README_COMPLETO.md](README_COMPLETO.md) - Documentación completa
