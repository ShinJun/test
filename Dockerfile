# docker build -t mnbao1975/dh-order .
FROM node:6.10.1

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
ENV NODE_ENV=production

#COPY package.json npm-shrinkwrap.json $HOME/
COPY package.json $HOME/
RUN chown -R app:app $HOME/*

# For testing
#RUN apt-get install ping


#USER app
WORKDIR $HOME
RUN npm install

USER root
COPY . $HOME
RUN chown -R app:app $HOME/*
USER app

EXPOSE 3000

CMD ["node", "app.js"]