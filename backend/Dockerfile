FROM node:20

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
