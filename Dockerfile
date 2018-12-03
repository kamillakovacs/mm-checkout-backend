FROM node:8
COPY . .
EXPOSE 3001
RUN npm install
CMD bash -c "node server.js"
