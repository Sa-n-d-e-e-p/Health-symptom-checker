FROM node:18-alpine

WORKDIR /app

COPY package.json ./
# Use legacy peer deps for ajv and framer-motion compatibility
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
