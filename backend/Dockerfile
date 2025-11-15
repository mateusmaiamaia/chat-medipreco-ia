FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm run start"]