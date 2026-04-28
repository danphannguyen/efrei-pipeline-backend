FROM node:22-alpine
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install --production

COPY . .
EXPOSE 3001
CMD ["npm", "start"]
