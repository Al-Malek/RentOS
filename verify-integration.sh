#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificando integración RentOS...${NC}"
echo ""

# Test 1: Backend
echo -e "${BLUE}1️⃣ Verificando backend...${NC}"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/vehiculos 2>/dev/null)
if [ "$BACKEND_STATUS" = "200" ] || [ "$BACKEND_STATUS" = "401" ]; then
  echo -e "${GREEN}✅ Backend OK (Status: $BACKEND_STATUS)${NC}"
  BACKEND_OK=true
else
  echo -e "${RED}❌ Backend ERROR (Status: $BACKEND_STATUS)${NC}"
  echo -e "${YELLOW}   Asegúrate de que el backend esté corriendo: cd rentos-backend && docker-compose up -d${NC}"
  BACKEND_OK=false
fi
echo ""

# Test 2: Frontend
echo -e "${BLUE}2️⃣ Verificando frontend...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$FRONTEND_STATUS" = "200" ] || [ "$FRONTEND_STATUS" = "307" ]; then
  echo -e "${GREEN}✅ Frontend OK (Status: $FRONTEND_STATUS)${NC}"
  FRONTEND_OK=true
else
  echo -e "${RED}❌ Frontend ERROR (Status: $FRONTEND_STATUS)${NC}"
  echo -e "${YELLOW}   Asegúrate de que el frontend esté corriendo: cd RentOS && npm run dev${NC}"
  FRONTEND_OK=false
fi
echo ""

# Test 3: Database
echo -e "${BLUE}3️⃣ Verificando PostgreSQL...${NC}"
if docker ps | grep -q postgres; then
  echo -e "${GREEN}✅ PostgreSQL corriendo${NC}"
  DB_OK=true
else
  echo -e "${RED}❌ PostgreSQL no encontrado${NC}"
  echo -e "${YELLOW}   Inicia PostgreSQL: cd rentos-backend && docker-compose up -d postgres${NC}"
  DB_OK=false
fi
echo ""

# Test 4: API Endpoints
if [ "$BACKEND_OK" = true ]; then
  echo -e "${BLUE}4️⃣ Verificando endpoints API...${NC}"
  ENDPOINTS=("vehiculos" "clientes" "reservas" "tarifas" "dashboard/metricas")
  ALL_ENDPOINTS_OK=true
  
  for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/$endpoint 2>/dev/null)
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
      echo -e "${GREEN}✅ /$endpoint (Status: $STATUS)${NC}"
    else
      echo -e "${RED}❌ /$endpoint (Status: $STATUS)${NC}"
      ALL_ENDPOINTS_OK=false
    fi
  done
  echo ""
fi

# Test 5: Environment Variables
echo -e "${BLUE}5️⃣ Verificando variables de entorno...${NC}"
if [ -f "RentOS/.env.local" ]; then
  if grep -q "NEXT_PUBLIC_API_URL" RentOS/.env.local; then
    API_URL=$(grep "NEXT_PUBLIC_API_URL" RentOS/.env.local | cut -d '=' -f2)
    echo -e "${GREEN}✅ NEXT_PUBLIC_API_URL configurado: $API_URL${NC}"
  else
    echo -e "${RED}❌ NEXT_PUBLIC_API_URL no encontrado en .env.local${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Archivo .env.local no encontrado${NC}"
  echo -e "${YELLOW}   Crea el archivo: cp RentOS/.env.local.example RentOS/.env.local${NC}"
fi

if [ -f "rentos-backend/.env" ]; then
  echo -e "${GREEN}✅ Backend .env encontrado${NC}"
else
  echo -e "${YELLOW}⚠️  Backend .env no encontrado${NC}"
  echo -e "${YELLOW}   Crea el archivo: cp rentos-backend/.env.example rentos-backend/.env${NC}"
fi
echo ""

# Test 6: Swagger Documentation
if [ "$BACKEND_OK" = true ]; then
  echo -e "${BLUE}6️⃣ Verificando Swagger docs...${NC}"
  SWAGGER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/docs 2>/dev/null)
  if [ "$SWAGGER_STATUS" = "200" ] || [ "$SWAGGER_STATUS" = "301" ]; then
    echo -e "${GREEN}✅ Swagger docs disponible: http://localhost:3001/api/docs${NC}"
  else
    echo -e "${YELLOW}⚠️  Swagger docs no accesible (Status: $SWAGGER_STATUS)${NC}"
  fi
  echo ""
fi

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Resumen de Verificación${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ] && [ "$DB_OK" = true ]; then
  echo -e "${GREEN}🎉 ¡Todo está funcionando correctamente!${NC}"
  echo ""
  echo -e "${GREEN}Accede a la aplicación:${NC}"
  echo -e "  ${BLUE}Frontend:${NC} http://localhost:3000"
  echo -e "  ${BLUE}Backend:${NC} http://localhost:3001"
  echo -e "  ${BLUE}Swagger:${NC} http://localhost:3001/api/docs"
  echo ""
  echo -e "${GREEN}Credenciales por defecto:${NC}"
  echo -e "  ${BLUE}Email:${NC} admin@rentos.com"
  echo -e "  ${BLUE}Password:${NC} admin123"
else
  echo -e "${RED}❌ Hay problemas que necesitan atención${NC}"
  echo ""
  echo -e "${YELLOW}Pasos para solucionar:${NC}"
  
  if [ "$DB_OK" = false ]; then
    echo -e "  1. ${YELLOW}Inicia PostgreSQL:${NC} cd rentos-backend && docker-compose up -d postgres"
  fi
  
  if [ "$BACKEND_OK" = false ]; then
    echo -e "  2. ${YELLOW}Inicia el backend:${NC} cd rentos-backend && docker-compose up -d"
    echo -e "     ${YELLOW}O en modo dev:${NC} cd rentos-backend && npm run start:dev"
  fi
  
  if [ "$FRONTEND_OK" = false ]; then
    echo -e "  3. ${YELLOW}Inicia el frontend:${NC} cd RentOS && npm run dev"
  fi
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
