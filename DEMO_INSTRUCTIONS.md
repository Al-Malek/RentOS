# 🎬 Instrucciones para Demo - RentOS

## ⚡ Inicio Rápido (5 minutos)

### 1. Levantar el Sistema

```bash
# Terminal 1 - Backend
cd c:\Users\buu\Downloads\rentos-backend
docker-compose up -d

# Esperar 30 segundos para que PostgreSQL inicie

# Terminal 2 - Frontend
cd c:\Users\buu\Downloads\RentOS
docker-compose up -d
```

### 2. Poblar Datos Iniciales

```bash
# En terminal del backend
cd c:\Users\buu\Downloads\rentos-backend
npm run seed
```

Esto creará:
- 1 usuario admin (admin@rentos.com / admin123)
- 5 vehículos de ejemplo
- 2 clientes de ejemplo
- 3 tarifas (descuento largo plazo, fin de semana, temporada alta)

### 3. Acceder al Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api

## 🎯 Flujo de Demo (10 minutos)

### Slide 1-3: Introducción (Esteban)
**Mostrar**: Página principal de RentOS
- Explicar el problema: gestión manual de alquiler de vehículos
- Mostrar la solución: sistema web completo

### Slide 4-6: Tecnologías y Arquitectura (Saenz)
**Mostrar**: 
1. Abrir Swagger docs (http://localhost:3001/api)
   - Mostrar endpoints organizados por módulos
   - Explicar arquitectura REST API

2. Abrir código en VS Code
   - Mostrar estructura de carpetas backend
   - Mostrar estructura de carpetas frontend

### Slide 7-9: Funcionalidades (Miguel)

#### 1. Dashboard (30 segundos)
**URL**: http://localhost:3000/dashboard
- Mostrar métricas en tiempo real
- Ingresos del mes
- Estado de la flota
- Gráfico de ingresos semanales

#### 2. Gestión de Vehículos (1 minuto)
**URL**: http://localhost:3000/dashboard/vehiculos
- Mostrar lista de vehículos
- Filtrar por estado (disponible, rentado, mantenimiento)
- Crear un nuevo vehículo (opcional)
- Mostrar detalles de un vehículo

#### 3. Gestión de Clientes (1 minuto)
**URL**: http://localhost:3000/dashboard/clientes
- Mostrar lista de clientes con scoring
- Buscar un cliente
- Mostrar detalles (historial, score)

#### 4. Sistema de Reservas (1.5 minutos)
**URL**: http://localhost:3000/dashboard/reservas
- Crear una nueva reserva
- Seleccionar vehículo
- Seleccionar cliente
- Elegir fechas
- Ver cálculo automático de precio con tarifas dinámicas
- Confirmar reserva

#### 5. Tarifas Dinámicas (1 minuto)
**URL**: http://localhost:3000/dashboard/tarifas
- Mostrar reglas de tarifas
- Explicar descuento 15% para 7+ días
- Explicar recargo 20% fin de semana
- Explicar recargo 30% temporada alta

#### 6. Asistente IA (2 minutos) ⭐
**URL**: http://localhost:3000/dashboard/asistente-ia
- Hacer preguntas al asistente:
  - "¿Cuál es el precio de alquiler?"
  - "¿Qué descuentos tienen?"
  - "¿Cómo funciona el mantenimiento?"
- Mostrar respuestas inteligentes con contexto
- Explicar integración con OpenAI GPT-3.5-turbo

#### 7. Notificaciones (30 segundos)
**URL**: http://localhost:3000/dashboard/notificaciones
- Mostrar historial de notificaciones
- Explicar confirmaciones automáticas
- Recordatorios 24h antes

#### 8. Multi-Tenancy (30 segundos)
**URL**: http://localhost:3000/superadmin/tenants
- Mostrar gestión de múltiples empresas
- Planes: básico, profesional, empresarial
- Límites por plan

### Slide 10: Tests y Docker (Esteban)

#### Mostrar Tests
```bash
# Terminal - Backend tests
cd c:\Users\buu\Downloads\rentos-backend
npm run test

# Mostrar resultados: 40+ tests passing
```

#### Mostrar Docker
```bash
# Mostrar contenedores corriendo
docker ps

# Mostrar logs
docker-compose logs backend --tail=20
```

## 🎤 Puntos Clave para Mencionar

### Técnicos:
- ✅ **Backend**: NestJS con 10 módulos, 40+ endpoints
- ✅ **Frontend**: Next.js 14 con App Router
- ✅ **Base de datos**: PostgreSQL con TypeORM
- ✅ **IA**: OpenAI GPT-3.5-turbo con knowledge base
- ✅ **Tests**: 80+ tests unitarios (40 backend + 40 frontend)
- ✅ **Docker**: Completamente containerizado

### Funcionales:
- ✅ **9 funcionalidades** completas (3 por integrante)
- ✅ **Tarifas dinámicas** con descuentos y recargos automáticos
- ✅ **Scoring de clientes** basado en historial
- ✅ **Verificación de disponibilidad** en tiempo real
- ✅ **Asistente IA** con respuestas contextuales
- ✅ **Multi-tenancy** para múltiples empresas

### Desafíos Superados:
- ✅ Integración completa frontend-backend
- ✅ Implementación de RAG con OpenAI
- ✅ Cálculo dinámico de tarifas
- ✅ Sistema de scoring de clientes
- ✅ Verificación de conflictos de reservas
- ✅ Sanitización anti-injection en IA

## 🚨 Troubleshooting Durante Demo

### Si el backend no responde:
```bash
# Reiniciar backend
cd c:\Users\buu\Downloads\rentos-backend
docker-compose restart backend
```

### Si el frontend no conecta:
```bash
# Verificar variable de entorno
cat c:\Users\buu\Downloads\RentOS\.env.local
# Debe tener: NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Si el asistente IA no responde:
- Mencionar que requiere API key de OpenAI válida
- Mostrar fallback a respuestas mock
- Explicar que en producción estaría configurado

### Si hay error de base de datos:
```bash
# Recrear base de datos
cd c:\Users\buu\Downloads\rentos-backend
docker-compose down -v
docker-compose up -d
npm run seed
```

## 📋 Checklist Pre-Demo

- [ ] Backend corriendo (docker ps)
- [ ] Frontend corriendo (docker ps)
- [ ] Datos seed cargados (npm run seed)
- [ ] Navegador abierto en http://localhost:3000
- [ ] Swagger docs abierto en http://localhost:3001/api
- [ ] VS Code abierto con el código
- [ ] Terminal lista para mostrar tests
- [ ] Presentación de slides lista

## 🎯 Preguntas Frecuentes

**P: ¿Cómo funciona el asistente IA?**
R: Usa OpenAI GPT-3.5-turbo con una knowledge base específica de RentOS. Incluye sanitización anti-injection y contexto de conversaciones previas.

**P: ¿Cómo se calculan las tarifas dinámicas?**
R: El sistema aplica reglas configurables: descuento 15% para 7+ días, recargo 20% fines de semana, recargo 30% temporada alta. Se pueden crear reglas personalizadas.

**P: ¿Cómo funciona el scoring de clientes?**
R: Score inicial de 100 puntos. +5 puntos por reserva completada, -10 puntos por cancelación. Ayuda a identificar clientes confiables.

**P: ¿El sistema es multi-tenant?**
R: Sí, soporta múltiples empresas con planes diferentes (básico, profesional, empresarial) y límites configurables.

**P: ¿Cuántos tests tiene el proyecto?**
R: 80+ tests unitarios (40 en backend con NestJS/Jest, 40 en frontend con React/Jest). Cobertura >80%.

**P: ¿Está listo para producción?**
R: El código está completo y funcional. Para producción faltaría: configurar variables de entorno, SSL/HTTPS, CI/CD, monitoreo, y backups.

## 🎬 Cierre de Demo

**Mencionar**:
- Sistema completo y funcional
- Todas las funcionalidades implementadas
- Tests completos
- Docker ready
- Código limpio y documentado
- Listo para escalar

**Agradecer**:
- Al profesor por la guía
- A los monitores por el soporte
- Al equipo por el trabajo colaborativo

---

**¡Buena suerte con la presentación! 🚀**
