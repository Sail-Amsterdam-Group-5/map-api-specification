FROM node:20-alpine
LABEL authors="earlybird"

WORKDIR /app

RUN mkdir /app/dist && chmod -R 777 /app/dist

COPY ../package.json package-lock.json ./

RUN npm install

COPY .. .

EXPOSE 3000

CMD ["npm", "start"]