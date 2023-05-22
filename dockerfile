# Stage 1: Build the Angular app
FROM node:16-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# Stage 2: Serve the app with nginx
FROM nginx:1.21-alpine

COPY --from=build /app/dist/* /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

