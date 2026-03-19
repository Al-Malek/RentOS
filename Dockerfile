# Dockerfile para desarrollo
FROM node:20-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo con hot reload
CMD ["npm", "run", "dev"]