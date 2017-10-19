FROM node:6.9.1
LABEL maintainer "Somprasong Damyos"
WORKDIR /nodeapp
COPY app /nodeapp
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]