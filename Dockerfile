FROM node:8
COPY . .
EXPOSE 3000
RUN npm install
CMD bash -c "node server.js"
