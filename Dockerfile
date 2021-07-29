FROM node:14.17

WORKDIR /build

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

EXPOSE 3333

VOLUME [ "/build/node_modules" ]

CMD [ "npm", "start" ]