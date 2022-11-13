##
## Build Container
##

FROM node:16 AS builder

# Copy app
WORKDIR /build
COPY . .

# Build app
RUN make install
RUN make build
RUN make certificate

##
## Runtime Container
##

FROM node:16-alpine

# Copy built project
WORKDIR /app
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/config ./config
COPY --from=builder /build/package.json package.json
COPY --from=builder /build/yarn.lock yarn.lock
COPY --from=builder /build/proxy.crt proxy.crt
COPY --from=builder /build/proxy.key proxy.key


# Install runtime dependencies
RUN yarn install --production

# Set startup script
ENTRYPOINT [ "node" ]
CMD [ "dist/main.js" ]
