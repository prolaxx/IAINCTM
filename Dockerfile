# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Crear directorio de la aplicación
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./ 
COPY tsconfig.json ./ 

# Instalar dependencias de desarrollo
RUN npm install

# Copiar todo el código fuente de la aplicación
COPY . .

# Construir el proyecto Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Instalar solo las dependencias de producción
RUN npm install --production

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
