#!/bin/bash

echo "🛑 Stopping RentOS System..."
echo ""

# Colors
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Stop Frontend
echo -e "${BLUE}Stopping Frontend...${NC}"
cd RentOS
docker-compose down
echo -e "${RED}✅ Frontend stopped${NC}"
echo ""

# Stop Backend
echo -e "${BLUE}Stopping Backend...${NC}"
cd ../rentos-backend
docker-compose down
echo -e "${RED}✅ Backend stopped${NC}"
echo ""

echo -e "${RED}🛑 RentOS System stopped${NC}"
echo ""
echo "To start again, run: ./start-all.sh"
