#!/bin/bash

echo "🚀 Starting RentOS System..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}📦 Starting Backend (NestJS + PostgreSQL)...${NC}"
cd rentos-backend
docker-compose up -d
echo -e "${GREEN}✅ Backend started${NC}"
echo ""

# Wait for PostgreSQL
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready (30 seconds)...${NC}"
sleep 30
echo -e "${GREEN}✅ PostgreSQL ready${NC}"
echo ""

# Seed database
echo -e "${BLUE}🌱 Seeding database with initial data...${NC}"
npm run seed
echo -e "${GREEN}✅ Database seeded${NC}"
echo ""

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend (Next.js)...${NC}"
cd ../RentOS
docker-compose up -d
echo -e "${GREEN}✅ Frontend started${NC}"
echo ""

# Show status
echo -e "${GREEN}🎉 RentOS System is ready!${NC}"
echo ""
echo "Access the application:"
echo -e "  ${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "  ${BLUE}Backend API:${NC} http://localhost:3001"
echo -e "  ${BLUE}Swagger Docs:${NC} http://localhost:3001/api"
echo ""
echo "Default credentials:"
echo -e "  ${BLUE}Email:${NC} admin@rentos.com"
echo -e "  ${BLUE}Password:${NC} admin123"
echo ""
echo "To stop the system, run: ./stop-all.sh"
