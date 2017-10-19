FROM node

RUN mkdir /app
WORKDIR /app

COPY ./ /app
RUN npm i

ENTRYPOINT [ "node", "/app/index.js", "-s", "/app/settings.js" ]
