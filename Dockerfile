FROM node:16

RUN apt-get update && \
    apt-get install -y python3 && \
    rm -rf /var/lib/apt/lists/* && 
    
RUN apt-get install -y python-pip

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "./server"]