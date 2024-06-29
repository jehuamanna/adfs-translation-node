FROM node:20.12.1-alpine

# Install dumb-init for process management.
RUN apk add --update --no-cache dumb-init

# Set the timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Kolkata

RUN mkdir -p /app && \
    chown node:node /app

# Use the built in 'node' user with least previliges.
USER node

WORKDIR /app

# Copy the source code into /app
COPY --chown=node:node --chmod=555 . .

EXPOSE 3001

CMD ["dumb-init", "node", "server.js"]