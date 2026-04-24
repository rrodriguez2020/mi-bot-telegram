# 1. La base: Usamos Node.js versión 18 (Alpine es una versión muy ligera y rápida)
FROM node:18-alpine

# 2. El directorio: Creamos una carpeta dentro del contenedor para nuestra app
WORKDIR /usr/src/app

# 3. Las dependencias: Copiamos los archivos de configuración de npm
# Usamos el comodín * para asegurar que tome package.json y package-lock.json
COPY package*.json ./

# 4. Instalación: Ejecutamos npm install dentro del contenedor
# Usamos --omit=dev para que la imagen sea más pequeña (solo instala lo necesario)
RUN npm install --omit=dev

# 5. El código: Copiamos el resto de tus archivos (incluyendo app.js)
COPY . .

# 6. El arranque: El comando que mantendrá vivo al bot
CMD ["node", "app.js"]
