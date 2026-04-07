# RentOS - Guía de Integración Frontend-Backend

## 🚀 Inicio Rápido

### Requisitos Previos
- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Git

### Ejecutar Todo el Sistema con Docker

```bash
# 1. Clonar ambos repositorios
cd c:\Users\buu\Downloads

# 2. Iniciar el backend (incluye PostgreSQL)
cd rentos-backend
docker-compose up -d

# 3. Iniciar el frontend
cd ../RentOS
docker-compose up -d
```

El sistema estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### Ejecutar en Modo Desarrollo (sin Docker)

#### Backend
```bash
cd rentos-backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd RentOS
npm install
npm run dev
```

## 📋 Arquitectura del Sistema

### Backend (NestJS + PostgreSQL)
```
rentos-backend/
├── src/
│   ├── auth/           # Autenticación JWT
│   ├── vehiculos/      # Gestión de vehículos
│   ├── clientes/       # Gestión de clientes
│   ├── reservas/       # Sistema de reservas
│   ├── tarifas/        # Cálculo dinámico de tarifas
│   ├── dashboard/      # Métricas y estadísticas
│   ├── rag/            # Asistente IA con OpenAI
│   ├── notificaciones/ # Sistema de notificaciones
│   ├── tenants/        # Multi-tenancy
│   └── mantenimiento/  # Gestión de mantenimiento
```

### Frontend (Next.js + React)
```
RentOS/
├── src/
│   ├── app/            # Páginas Next.js
│   ├── components/     # Componentes React
│   ├── hooks/          # Custom hooks (integrados con API)
│   ├── lib/            # API client
│   └── data/           # Mock data (fallback)
```

## 🔌 Integración Frontend-Backend

### 1. API Client (`RentOS/src/lib/api.ts`)

El cliente API maneja todas las comunicaciones con el backend:

```typescript
import { api } from '@/lib/api';

// Ejemplo de uso
const vehiculos = await api.getVehiculos();
const reserva = await api.createReserva(data);
```

### 2. Hooks Actualizados

Todos los hooks ahora usan el API client con fallback a localStorage:

#### useVehiculos
```typescript
const { vehiculos, loading, error, createVehiculo, updateVehiculo, deleteVehiculo } = useVehiculos();
```

#### useClientes
```typescript
const { clientes, loading, error, crearCliente, actualizarCliente, buscarClientes } = useClientes();
```

#### useReservas
```typescript
const { reservas, loading, error, crearReserva, cancelarReserva, verificarDisponibilidad } = useReservas();
```

#### useTarifas
```typescript
const { tarifas, loading, error, calcularPrecioFinal } = useTarifas();
```

#### useDashboard
```typescript
const { ingresosMesActual, flotaTotal, tasaOcupacion, topVehiculos, loading } = useDashboard();
```

### 3. Autenticación

El sistema usa JWT para autenticación:

```typescript
// Login
const { access_token } = await api.login(email, password);
localStorage.setItem('rentos_token', access_token);

// Las peticiones subsecuentes incluyen automáticamente el token
```

### 4. Asistente IA (RAG)

El asistente IA usa OpenAI GPT-3.5-turbo con knowledge base sobre RentOS:

```typescript
// Frontend
const response = await fetch('/api/rag/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Pregunta del usuario' })
});

// Backend procesa con OpenAI y knowledge base
```

## 🧪 Pruebas

### Backend
```bash
cd rentos-backend
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage
```

### Frontend
```bash
cd RentOS
npm run test              # Jest tests
npm run test:watch        # Watch mode
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (`.env`)
```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=rentos
DATABASE_PASSWORD=rentos123
DATABASE_NAME=rentos_db
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📊 Base de Datos

### Entidades Principales

1. **User**: Usuarios del sistema (admin, operador)
2. **Vehiculo**: Flota de vehículos
3. **Cliente**: Clientes con scoring
4. **Reserva**: Reservas con pagos y desglose
5. **Tarifa**: Reglas de precios dinámicos
6. **Notificacion**: Historial de notificaciones
7. **Conversation**: Historial de chat IA
8. **Tenant**: Multi-tenancy

### Migraciones

TypeORM está configurado con `synchronize: true` en desarrollo, creando automáticamente las tablas.

Para producción, generar migraciones:
```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 🚨 Troubleshooting

### Backend no conecta a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs
docker-compose logs postgres
```

### Frontend no conecta al Backend
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3001/health

# Verificar variable de entorno
echo $NEXT_PUBLIC_API_URL
```

### Asistente IA no responde
```bash
# Verificar API key de OpenAI
echo $OPENAI_API_KEY

# Ver logs del backend
docker-compose logs backend
```

## 📈 Próximos Pasos

1. ✅ Backend completo con NestJS
2. ✅ Frontend integrado con API
3. ✅ Asistente IA funcional
4. ✅ Pruebas unitarias backend
5. ⏳ Seed data inicial
6. ⏳ Migraciones de base de datos
7. ⏳ Despliegue en producción

## 🤝 Equipo

- **Esteban**: Gestión de vehículos, clientes, reservas
- **Saenz**: Tarifas, dashboard, notificaciones
- **Miguel**: Asistente IA, multi-tenancy, mantenimiento

## 📝 Notas Importantes

- El sistema tiene fallback a localStorage si el backend no está disponible
- Las imágenes de vehículos usan URLs de Unsplash
- El asistente IA requiere API key de OpenAI válida
- Multi-tenancy está implementado pero requiere configuración adicional
