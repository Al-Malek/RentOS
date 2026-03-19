# RentOS - Sistema de Gestión de Alquiler de Vehículos

Plataforma SaaS para la gestión integral de alquiler de vehículos y flotas.

## 🚀 Inicio Rápido con Docker

```bash
# Instalar dependencias del proyecto
npm install
```

### 3. Ejecución local

```bash
npm run dev
```

### 4. Verificación rápida

```bash
npm run test
npm run build
```

Abre tu navegador en `http://localhost:3000`

<<<<<<< HEAD
## Justificaciones Técnicas
* **Next.js & TypeScript:** Elegidos para asegurar escalabilidad y tipado fuerte, reduciendo errores en tiempo de ejecución.
* **i18n & a11y:** Internacionalización y accesibilidad implementadas a nivel de aplicación con contexto y etiquetas ARIA.
* **Docker:** Garantiza que el entorno de desarrollo sea idéntico al de producción. 
=======
## 📋 Requisitos
>>>>>>> 0be1bb153886424102e79b6bf1b1e34d02f1af8f

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado

## 🐳 Comandos Docker

```bash
# Iniciar
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reconstruir (después de cambios en package.json)
docker-compose up --build

# Limpiar todo y empezar de nuevo
docker-compose down -v
docker system prune -f
docker-compose up --build
```

## 🧪 Ejecutar Tests

```bash
# Dentro del contenedor
docker-compose exec web npm test

# Tests en modo watch
docker-compose exec web npm run test:watch

# Tests con cobertura
docker-compose exec web npm run test:coverage
```

## 💻 Desarrollo Local (sin Docker)

Si prefieres no usar Docker:

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm test
```

## 🛠️ Tecnologías

- Next.js 16 + TypeScript
- Tailwind CSS
- Jest + Testing Library
- Docker
- Recharts

## 📁 Estructura

```
RentOS/
├── src/
│   ├── app/              # Páginas (Next.js App Router)
│   ├── components/       # Componentes React
│   ├── hooks/            # Custom hooks + tests
│   ├── data/             # Datos mock
│   └── services/         # Lógica de negocio
├── Dockerfile            # Configuración Docker
├── docker-compose.yml    # Orquestación Docker
└── package.json          # Dependencias
```

## 🔧 Solución de Problemas

**Docker no inicia:**
- Verifica que Docker Desktop esté corriendo
- Reinicia Docker Desktop

**Puerto 3000 ocupado:**
Edita `docker-compose.yml` y cambia:
```yaml
ports:
  - "3001:3000"
```

**Cambios no se reflejan:**
```bash
docker-compose down
docker-compose up --build
```