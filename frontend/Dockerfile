FROM node:18-alpine3.19

WORKDIR /frontend

COPY . .

RUN npm install

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build"]