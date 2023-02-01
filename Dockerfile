FROM node:16

RUN apt-get update && \
    apt install ffmpeg -y

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "./server"]