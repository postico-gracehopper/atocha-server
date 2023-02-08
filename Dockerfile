FROM node:18-alpine

RUN apk update && \
    apk add ffmpeg

WORKDIR /app

ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]