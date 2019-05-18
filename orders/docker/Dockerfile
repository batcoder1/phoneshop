FROM node:8

ENV NODEPATH /opt/app

RUN mkdir -p $NODEPATH

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 80 for node
ARG PORT=80

EXPOSE $PORT 7777 8080

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /opt
COPY package.json /opt
COPY yarn.lock /opt
RUN yarn && yarn cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR $NODEPATH
COPY . $NODEPATH

# Set argument for docker container name
ARG CONTAINER_NAME=orders-api

# Set volume
VOLUME $NODEPATH

# Start node webserver
CMD [ "npm", "start" ]