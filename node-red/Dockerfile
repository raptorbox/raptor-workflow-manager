FROM node

RUN mkdir /app
WORKDIR /app
ENV DATADIR /app/data

COPY ./ /app
RUN npm i --only=prod

ENTRYPOINT [ "node", "/app/bin/cli.js", "-s", "/app/settings.js" ]
