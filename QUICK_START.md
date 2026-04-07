# ⚡ Quick Start - RentOS

## 🚀 Inicio en 3 Comandos

### Windows:
```bash
cd c:\Users\buu\Downloads
start-all.bat
```

### Linux/Mac:
```bash
cd ~/Downloads
chmod +x start-all.sh
./start-all.sh
```

Espera 30 segundos y abre: **http://localhost:3000**

---

## ✅ Verificar que Todo Funciona

### Windows:
```bash
verify-integration.bat
```

### Linux/Mac:
```bash
chmod +x verify-integration.sh
./verify-integration.sh
```

---

## 📊 URLs Importantes

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:3001 | - |
| **Swagger Docs** | http://localhost:3001/api/docs | - |
| **Login** | http://localhost:3000 | admin@rentos.com / admin123 |

---

## 🔧 Configuración para Vercel

### 1. Backend (Railway/Render)
```env
CORS_ORIGIN=https://tu-app.vercel.app
DATABASE_HOST=<auto>
DATABASE_PORT=5432
JWT_SECRET=<generar-seguro>
OPENAI_API_KEY=sk-<opcional>
```

### 2. Frontend (Vercel Dashboard)
```env
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
```

### 3. Verificar
Abre: `https://tu-app.vercel.app/dashboard`
- DevTools (F12) > Network
- Verifica requests a tu backend
- Status 200 = ✅ Funciona

---

## 🐛 Solución Rápida de Problemas

### Backend no responde
```bash
cd rentos-backend
docker-compose restart backend
```

### Frontend no conecta
```bash
# Verificar .env.local
cat RentOS/.env.local
# Debe tener: NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Error de CORS
```bash
# En backend .env agregar:
CORS_ORIGIN=https://tu-frontend.vercel.app
# Reiniciar backend
```

---

## 📚 Documentación Completa

- **[RESPUESTAS_A_TUS_PREGUNTAS.md](RESPUESTAS_A_TUS_PREGUNTAS.md)** ⭐ Empieza aquí
- **[COMO_VERIFICAR_TODO.md](COMO_VERIFICAR_TODO.md)** - Verificación paso a paso
- **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** - Despliegue en Vercel
- **[README_COMPLETO.md](README_COMPLETO.md)** - Documentación completa

---

## 🎯 Checklist Rápido

- [ ] Backend corriendo (http://localhost:3001/health)
- [ ] Frontend corriendo (http://localhost:3000)
- [ ] Dashboard muestra datos
- [ ] Sin errores en consola
- [ ] Tests pasan (npm run test)

---

**¿Problemas?** Lee [RESPUESTAS_A_TUS_PREGUNTAS.md](RESPUESTAS_A_TUS_PREGUNTAS.md)
