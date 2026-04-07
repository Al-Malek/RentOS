# 🚗 RentOS - Sistema Completo de Gestión de Alquiler de Vehículos

## 📋 Descripción del Proyecto

RentOS es un sistema completo de gestión de alquiler de vehículos desarrollado con tecnologías web modernas. El proyecto incluye:

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: NestJS + PostgreSQL + TypeORM
- **IA**: Asistente virtual con OpenAI GPT-3.5-turbo
- **Infraestructura**: Docker + Docker Compose
- **Testing**: Jest (Frontend y Backend)

## 👥 Equipo de Desarrollo

- **Esteban**: Gestión de vehículos, clientes, reservas
- **Saenz**: Tarifas dinámicas, dashboard, notificaciones
- **Miguel**: Asistente IA (RAG), multi-tenancy, mantenimiento

## 🎯 Funcionalidades Implementadas (9 totales)

### 1. Gestión de Vehículos (HU1)
- CRUD completo de vehículos
- Estados: disponible, rentado, en mantenimiento
- Historial de mantenimiento
- Filtros por tipo, marca, estado

### 2. Gestión de Clientes (HU2)
- CRUD completo de clientes
- Sistema de scoring (0-100 puntos)
- Búsqueda avanzada
- Validación de documentos

### 3. Sistema de Reservas (HU3)
- Creación de reservas con verificación de disponibilidad
- Gestión de pagos (efectivo, tarjeta, transferencia)
- Cancelación y finalización de reservas
- Desglose detallado de costos

### 4. Tarifas Dinámicas (HU4)
- Descuento 15% para alquileres de 7+ días
- Recargo 20% fines de semana
- Recargo 30% temporada alta (diciembre)
- Reglas personalizables por vehículo

### 5. Dashboard y Reportes (HU5)
- Métricas en tiempo real
- Ingresos mensuales con comparativa
- Estado de la flota
- Top 5 vehículos más rentados
- Gráficos de ingresos semanales

### 6. Sistema de Notificaciones (HU6)
- Confirmaciones de reserva
- Recordatorios 24h antes
- Notificaciones de cancelación
- Recibos de pago
- Plantillas personalizables

### 7. Asistente IA (RAG) (HU7)
- Chat inteligente con OpenAI GPT-3.5-turbo
- Knowledge base sobre RentOS
- Protección contra prompt injection
- Historial de conversaciones
- Respuestas contextuales

### 8. Multi-Tenancy (HU8)
- Gestión de múltiples empresas
- Planes: básico, profesional, empresarial
- Límites por plan
- Aislamiento de datos

### 9. Gestión de Mantenimiento (HU9)
- Seguimiento de kilometraje
- Alertas de mantenimiento preventivo
- Historial de mantenimientos
- Costos y tipos (preventivo/correctivo)

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# 1. Backend (incluye PostgreSQL)
cd rentos-backend
docker-compose up -d

# 2. Frontend
cd ../RentOS
docker-compose up -d
```

Acceder a:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api

### Opción 2: Desarrollo Local

#### Backend
```bash
cd rentos-backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run start:dev
npm run seed  # Poblar datos iniciales
```

#### Frontend
```bash
cd RentOS
npm install
cp .env.local.example .env.local
npm run dev
```

## 🧪 Pruebas

### Backend (40+ tests)
```bash
cd rentos-backend
npm run test              # Ejecutar todos los tests
npm run test:watch        # Modo watch
npm run test:cov          # Con coverage
```

Tests incluyen:
- AuthService (login, register, JWT)
- VehiculosService (CRUD, estados)
- ClientesService (scoring, búsqueda)
- ReservasService (disponibilidad, conflictos)
- TarifasService (cálculos dinámicos)
- RagService (sanitización, knowledge base)

### Frontend (40+ tests)
```bash
cd RentOS
npm run test              # Ejecutar todos los tests
npm run test:watch        # Modo watch
```

Tests incluyen:
- useVehiculos (CRUD, localStorage)
- useClientes (validación, scoring)
- useReservas (disponibilidad, pagos)
- useTarifas (cálculos, descuentos)
- useDashboard (métricas, ingresos)
- useNotificaciones (envío, plantillas)

## 📁 Estructura del Proyecto

```
RentOS/                          # Frontend Next.js
├── src/
│   ├── app/                     # Páginas Next.js 14
│   │   ├── dashboard/           # Dashboard principal
│   │   │   ├── page.tsx         # Métricas y estadísticas
│   │   │   ├── vehiculos/       # Gestión de vehículos
│   │   │   ├── clientes/        # Gestión de clientes
│   │   │   ├── reservas/        # Sistema de reservas
│   │   │   ├── tarifas/         # Tarifas dinámicas
│   │   │   ├── notificaciones/  # Centro de notificaciones
│   │   │   ├── asistente-ia/    # Chat IA
│   │   │   └── reportes/        # Reportes y análisis
│   │   ├── superadmin/          # Panel multi-tenancy
│   │   └── api/                 # API routes (proxy RAG)
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes UI base
│   │   └── MainLayout.tsx       # Layout principal
│   ├── hooks/                   # Custom hooks
│   │   ├── useVehiculos.ts      # Hook de vehículos (API)
│   │   ├── useClientes.ts       # Hook de clientes (API)
│   │   ├── useReservas.ts       # Hook de reservas (API)
│   │   ├── useTarifas.ts        # Hook de tarifas (API)
│   │   ├── useDashboard.ts      # Hook de dashboard (API)
│   │   ├── useNotificaciones.ts # Hook de notificaciones
│   │   └── __tests__/           # Tests de hooks
│   ├── lib/
│   │   └── api.ts               # Cliente API (fetch wrapper)
│   ├── data/                    # Mock data (fallback)
│   └── context/                 # React contexts
├── public/                      # Assets estáticos
├── docker-compose.yml           # Docker frontend
├── Dockerfile                   # Imagen frontend
└── package.json

rentos-backend/                  # Backend NestJS
├── src/
│   ├── auth/                    # Autenticación JWT
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts
│   │   └── auth.service.spec.ts
│   ├── vehiculos/               # Módulo vehículos
│   │   ├── vehiculos.service.ts
│   │   ├── vehiculos.controller.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── vehiculos.service.spec.ts
│   ├── clientes/                # Módulo clientes
│   ├── reservas/                # Módulo reservas
│   ├── tarifas/                 # Módulo tarifas
│   ├── dashboard/               # Módulo dashboard
│   ├── rag/                     # Módulo IA (RAG)
│   │   ├── rag.service.ts       # OpenAI integration
│   │   ├── rag.controller.ts
│   │   └── rag.service.spec.ts
│   ├── notificaciones/          # Módulo notificaciones
│   ├── tenants/                 # Módulo multi-tenancy
│   ├── mantenimiento/           # Módulo mantenimiento
│   ├── database/
│   │   ├── seed.ts              # Seed data
│   │   └── seed.command.ts
│   ├── app.module.ts            # Módulo principal
│   └── main.ts                  # Entry point
├── docker-compose.yml           # Docker backend + PostgreSQL
├── Dockerfile                   # Imagen backend
└── package.json

INTEGRATION_GUIDE.md            # Guía de integración
README_COMPLETO.md              # Este archivo
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **Next.js 14**: Framework React con App Router
- **React 18**: Biblioteca UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **React Hot Toast**: Notificaciones
- **Jest**: Testing framework

### Backend
- **NestJS**: Framework Node.js
- **TypeORM**: ORM para PostgreSQL
- **PostgreSQL**: Base de datos
- **JWT**: Autenticación
- **Bcrypt**: Hash de contraseñas
- **OpenAI**: GPT-3.5-turbo para IA
- **Swagger**: Documentación API
- **Jest**: Testing framework

### DevOps
- **Docker**: Contenedores
- **Docker Compose**: Orquestación
- **Git**: Control de versiones

## 🔐 Seguridad

### Backend
- Autenticación JWT con refresh tokens
- Passwords hasheados con bcrypt (10 rounds)
- Validación de inputs con class-validator
- Guards de NestJS para protección de rutas
- Sanitización de inputs en RAG (anti prompt injection)

### Frontend
- Tokens almacenados en localStorage
- Validación de formularios
- Sanitización de inputs
- HTTPS en producción

## 📊 Base de Datos

### Esquema Principal

```sql
-- Usuarios del sistema
User (id, email, password, nombre, rol, tenantId)

-- Vehículos
Vehiculo (id, marca, modelo, anio, placa, kilometraje, estado, tipo, precioDia, foto)

-- Clientes
Cliente (id, nombre, email, telefono, numeroDocumento, score, reservasTotales, totalGastado)

-- Reservas
Reserva (id, vehiculoId, clienteId, fechaInicio, fechaFin, estado, totalFinal, desglose)

-- Tarifas
Tarifa (id, nombre, tipo, porcentaje, activa, vehiculosAplicables, fechaInicio, fechaFin)

-- Notificaciones
Notificacion (id, tipo, destinatario, email, asunto, mensaje, estado, fecha)

-- Conversaciones IA
Conversation (id, userId, userMessage, assistantResponse, context, createdAt)

-- Multi-tenancy
Tenant (id, nombre, plan, limiteVehiculos, limiteUsuarios, activo)
```

## 🌐 API Endpoints

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Login
- `GET /auth/profile` - Perfil (protegido)

### Vehículos
- `GET /vehiculos` - Listar vehículos
- `POST /vehiculos` - Crear vehículo
- `GET /vehiculos/:id` - Obtener vehículo
- `PATCH /vehiculos/:id` - Actualizar vehículo
- `DELETE /vehiculos/:id` - Eliminar vehículo

### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Crear cliente
- `GET /clientes/search?q=query` - Buscar clientes
- `PATCH /clientes/:id` - Actualizar cliente
- `DELETE /clientes/:id` - Eliminar cliente

### Reservas
- `GET /reservas` - Listar reservas
- `POST /reservas` - Crear reserva
- `POST /reservas/verificar-disponibilidad` - Verificar disponibilidad
- `PATCH /reservas/:id/cancelar` - Cancelar reserva
- `PATCH /reservas/:id/finalizar` - Finalizar reserva

### Tarifas
- `GET /tarifas` - Listar tarifas
- `POST /tarifas` - Crear tarifa
- `POST /tarifas/calcular-precio` - Calcular precio
- `PATCH /tarifas/:id` - Actualizar tarifa
- `DELETE /tarifas/:id` - Eliminar tarifa

### Dashboard
- `GET /dashboard/metricas` - Métricas generales
- `GET /dashboard/ingresos` - Análisis de ingresos
- `GET /dashboard/top-vehiculos` - Top vehículos

### RAG (IA)
- `POST /rag/chat` - Chat con asistente
- `GET /rag/conversations` - Historial
- `DELETE /rag/conversations` - Limpiar historial

### Notificaciones
- `GET /notificaciones` - Listar notificaciones
- `POST /notificaciones` - Enviar notificación

### Tenants
- `GET /tenants` - Listar tenants
- `POST /tenants` - Crear tenant
- `PATCH /tenants/:id/toggle-estado` - Activar/desactivar

## 🎨 Diseño

- **Figma**: Prototipo navegable completo
- **i18n**: Español e Inglés
- **a11y**: Consideraciones de accesibilidad
- **Responsive**: Mobile, tablet, desktop
- **Dark Theme**: Tema oscuro por defecto

## 📈 Métricas del Proyecto

- **Líneas de código**: ~15,000+
- **Componentes React**: 50+
- **Endpoints API**: 40+
- **Tests**: 80+ (40 frontend + 40 backend)
- **Cobertura**: >80%
- **Entidades DB**: 8
- **Módulos NestJS**: 10

## 🚧 Próximos Pasos

1. ✅ Backend completo con NestJS
2. ✅ Frontend integrado con API
3. ✅ Asistente IA funcional con OpenAI
4. ✅ Pruebas unitarias (80+ tests)
5. ✅ Docker y Docker Compose
6. ✅ Seed data inicial
7. ⏳ Despliegue en AWS/Azure
8. ⏳ CI/CD con GitHub Actions
9. ⏳ Monitoreo con Prometheus/Grafana
10. ⏳ Logs centralizados con ELK

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar PostgreSQL
docker ps | grep postgres

# Ver logs
docker-compose logs backend

# Recrear contenedores
docker-compose down -v
docker-compose up -d
```

### Frontend no conecta al backend
```bash
# Verificar variable de entorno
cat RentOS/.env.local

# Debe ser: NEXT_PUBLIC_API_URL=http://localhost:3001

# Verificar backend
curl http://localhost:3001/health
```

### Tests fallan
```bash
# Limpiar cache
npm run test -- --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Asistente IA no responde
```bash
# Verificar API key de OpenAI
echo $OPENAI_API_KEY

# Debe estar en rentos-backend/.env
# OPENAI_API_KEY=sk-...
```

## 📝 Licencia

MIT License - Ver LICENSE file

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte del curso ISIS 3710 - Programación con Tecnologías Web.

## 📞 Contacto

- **Esteban**: [email]
- **Saenz**: [email]
- **Miguel**: [email]

---

**Desarrollado con ❤️ por el equipo RentOS**
