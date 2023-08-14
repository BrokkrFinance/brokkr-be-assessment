FROM node:16
WORKDIR /app

COPY . .
RUN npm ci --only=production
RUN npm run build

EXPOSE 3000
ENV NODE_ENV production

CMD [ "node", "./dist/app.js" ]
