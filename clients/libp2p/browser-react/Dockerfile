# Use an official Node.js runtime as the base image
FROM node:21.6.0-alpine3.18

# Set the working directory inside the container
WORKDIR /app

RUN npm install -g "serve@^14.2.1" && \
    npm install \
    "@babel/plugin-transform-nullish-coalescing-operator@^7.23.4" \
    "@babel/plugin-transform-object-rest-spread@7.23.4" \
    "@babel/plugin-transform-numeric-separator@^7.23.4" \
    "@babel/plugin-transform-optional-catch-binding@^7.23.4" \
    "@babel/plugin-transform-optional-chaining@^7.23.4" \
    "@babel/plugin-transform-class-properties@^7.23.3" \
    "@babel/plugin-transform-async-generator-functions@^7.23.4" \
    "node-domexception@^2.0.1" \
    "@multiformats/multiaddr@^10.5.0" \
    "punycode@^2.3.1"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install additional dependencies


# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000 4001 4002

# Set the command to start the app
CMD ["serve", "-s", "build"]
# CMD ["npm", "run", "start", "--trace-warnings"]
