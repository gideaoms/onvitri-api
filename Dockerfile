FROM bitnami/node:16.13.1
WORKDIR /usr/app/
COPY package*.json ./
RUN npm install --silent --progress=false
COPY . .
EXPOSE ${APP_PORT}
CMD ["npm", "run", "start"]
