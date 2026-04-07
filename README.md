# 🚗 RentOS - Sistema de Gestión de Alquiler de Vehículos

Sistema completo de gestión de alquiler de vehículos con frontend Next.js, backend NestJS, PostgreSQL y asistente IA con OpenAI.

## 🚀 Inicio Rápido

### Windows
```bash
start-all.bat
```

### Linux/Mac
```bash
chmod +x start-all.sh
./start-all.sh
```

El sistema estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api

**Credenciales por defecto**:
- Email: `admin@rentos.com`
- Password: `admin123`

## 📁 Estructura del Proyecto

```
.
├── RentOS/                  # Frontend Next.js
├── rentos-backend/          # Backend NestJS
├── start-all.bat           # Script inicio Windows
├── start-all.sh            # Script inicio Linux/Mac
├── stop-all.bat            # Script detener Windows
├── stop-all.sh             # Script detener Linux/Mac
├── README.md               # Este archivo
├── README_COMPLETO.md      # Documentación completa
├── INTEGRATION_GUIDE.md    # Guía de integración
├── DEMO_INSTRUCTIONS.md    # Instrucciones para demo
└── RESUMEN_FINAL.md        # Resumen del trabajo
```

## 📚 Documentación

- **[README_COMPLETO.md](README_COMPLETO.md)** - Documentación exhaustiva del proyecto
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Guía de integración frontend-backend
- **[DEMO_INSTRUCTIONS.md](DEMO_INSTRUCTIONS.md)** - Instrucciones para presentación
- **[RESUMEN_FINAL.md](RESUMEN_FINAL.md)** - Resumen del trabajo completado

## ✨ Funcionalidades

1. **Gestión de Vehículos** - CRUD completo, estados, mantenimiento
2. **Gestión de Clientes** - CRUD, sistema de scoring, búsqueda
3. **Sistema de Reservas** - Verificación de disponibilidad, pagos
4. **Tarifas Dinámicas** - Descuentos y recargos automáticos
5. **Dashboard** - Métricas en tiempo real, análisis de ingresos
6. **Notificaciones** - Emails automáticos, plantillas
7. **Asistente IA** - Chat con OpenAI GPT-3.5-turbo
8. **Multi-Tenancy** - Gestión de múltiples empresas
9. **Mantenimiento** - Seguimiento preventivo y correctivo

## 🧪 Ejecutar Tests

### Backend (40+ tests)
```bash
cd rentos-backend
npm run test
```

### Frontend (40+ tests)
```bash
cd RentOS
npm run test
```

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **IA**: OpenAI GPT-3.5-turbo
- **Testing**: Jest
- **DevOps**: Docker, Docker Compose

## 👥 Equipo

- **Esteban** - Vehículos, Clientes, Reservas
- **Saenz** - Tarifas, Dashboard, Notificaciones
- **Miguel** - Asistente IA, Multi-tenancy, Mantenimiento

## 📊 Estadísticas

- **Líneas de código**: 15,000+
- **Tests**: 80+ (40 backend + 40 frontend)
- **Endpoints API**: 40+
- **Componentes React**: 50+
- **Módulos NestJS**: 10

## 🐛 Troubleshooting

### Backend no inicia
```bash
cd rentos-backend
docker-compose down -v
docker-compose up -d
```

### Frontend no conecta
Verificar `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Ver logs
```bash
# Backend
cd rentos-backend
docker-compose logs backend

# Frontend
cd RentOS
docker-compose logs frontend
```

## 📝 Licencia

MIT License

---

**Desarrollado con ❤️ por el equipo RentOS**

Para más información, ver [README_COMPLETO.md](README_COMPLETO.md)
