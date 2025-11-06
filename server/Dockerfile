FROM node:20-alpine

WORKDIR /app
# install dependencies
COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Default command
ENTRYPOINT ["node", "app.js"]