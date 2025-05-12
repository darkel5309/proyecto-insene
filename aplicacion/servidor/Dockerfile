FROM node:20-alpine

RUN apk add --no-cache tzdata \
    && ln -sf /usr/share/zoneinfo/Europe/Madrid /etc/localtime \
    && echo "Europe/Madrid" > /etc/timezone

ENV TZ=Europe/Madrid

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev"]
